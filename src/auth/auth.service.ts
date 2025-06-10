import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../database/entity/user.entity';
import { CategoryEntity } from 'src/database/entity/category.entity';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { Model } from 'dynamoose/dist/Model';
import { UserSchema } from 'src/database/schema/user.schema';
import { CategorySchema } from 'src/database/schema/category.schema';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private UserInstance: Model<UserEntity>;
  private CategoryInstance: Model<CategoryEntity>;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.UserInstance = dynamoose.model<UserEntity>('Users', UserSchema);
    this.CategoryInstance = dynamoose.model<CategoryEntity>(
      'Categories',
      CategorySchema,
    );
  }

  async signup(email: string, password: string, name: string) {
    try {
      const existing = await this.UserInstance.query('email').eq(email).exec();

      if (existing.count > 0) {
        throw new ConflictException('User already exists');
      }

      const newUser = await this.UserInstance.create({
        email,
        name,
        password: bcrypt.hashSync(password, 8),
      });

      const defaultCategories = [
        { name: 'Food', color: '#FFC107' },
        { name: 'Medicine', color: '#CDDC39' },
        { name: 'Travel', color: '#00BCD4' },
        { name: 'Entertainment', color: '#607D8B' },
      ];

      const categoryPromises = defaultCategories.map((cat) =>
        this.CategoryInstance.create({
          user_id: newUser.id,
          category: cat.name,
          limit: 1000,
          color: cat.color,
        }),
      );

      await Promise.all(categoryPromises);

      return { ...newUser };
    } catch (error) {
      console.error('Error during signup:', error);
      throw new InternalServerErrorException('Failed to signup user');
    }
  }

  async login(email: string, password: string) {
    try {
      const users = await this.UserInstance.query('email').eq(email).exec();

      const userData = users[0];

      if (!userData) {
        throw new UnauthorizedException('User not found');
      }

      const isPasswordValid = bcrypt.compareSync(password, userData.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = { sub: userData.id, email: userData.email };

      const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '30d' });

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await this.UserInstance.update(
        { id: userData.id },
        { refreshToken: hashedRefreshToken },
      );

      return {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Error during login process:', error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateProfile(id: string, name: string) {
    const user = await this.UserInstance.get(id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.UserInstance.update({ id: id }, { name: name });

    return { message: 'Profile updated successfully' };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.UserInstance.get(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 8);
    await this.UserInstance.update(
      { id: userId },
      { password: hashedNewPassword },
    );

    return { message: 'Password updated successfully' };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.UserInstance.get(decoded.sub);

      if (!user) throw new UnauthorizedException('User not found');

      // Verify if refresh token matches stored (hash compare)
      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      // Issue new access token
      const payload = { sub: user.id, email: user.email };

      const newAccessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string, userid: string) {
    const userRecords = await this.UserInstance.query('id').eq(userid).exec();

    if (!userRecords || userRecords.count === 0) {
      throw new UnauthorizedException('User not found');
    }

    const userRecord = userRecords[0];

    const isValid = await bcrypt.compare(refreshToken, userRecord.refreshToken);

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    userRecord.refreshToken = '';
    userRecord.expoPushToken = '';

    await this.UserInstance.update(userRecord);

    return { message: 'Logout successful' };
  }

  async sendPasswordResetLink(email: string) {
    const users = await this.UserInstance.query('email').eq(email).exec();

    const user = users[0];

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const token = uuidv4();
    const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour from now

    await this.UserInstance.update(
      { id: user.id },
      { rp_token: token, rp_token_expiry: expiresAt },
    );

    const resetUrl = `https://reset.moneynut.co.in/reset-password?token=${token}`;

    const html = `
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await this.sendMail(email, 'Reset Your Password - MoneyNut', html);
    return { message: 'Reset link sent to email' };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const [user] = await this.UserInstance.scan({
      email: email,
      rp_token: token,
    }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!user.rp_token_expiry || Date.now() > user.rp_token_expiry) {
      throw new UnauthorizedException('Token has expired');
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 8);

    await this.UserInstance.update(
      { id: user.id },
      {
        password: hashedNewPassword,
        refreshToken: '',
        rp_token: '',
        rp_token_expiry: 0,
      },
    );

    return { message: 'Password reset successful' };
  }

  private async sendMail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user: 'admin@moneynut.co.in',
        pass: 'HlXYCr1NYYh',
      },
    });
    await transporter.sendMail({
      from: 'MoneyNut <admin@moneynut.co.in>',
      to,
      subject,
      html,
    });
  }
}
