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

@Injectable()
export class AuthService {
  private UserInstance: Model<UserEntity>;
  private CategoryInstance: Model<CategoryEntity>;

  constructor(private jwtService: JwtService) {
    this.UserInstance = dynamoose.model<UserEntity>('Users', UserSchema);
    this.CategoryInstance = dynamoose.model<CategoryEntity>(
      'Categories',
      CategorySchema,
    );
  }

  async signup(email: string, password: string, name: string) {
    const existing = await this.UserInstance.scan({ email }).exec();

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
  }

  async login(email: string, password: string) {
    try {
      // Check if user exists
      const [userData] = await this.UserInstance.scan()
        .where('email')
        .eq(email)
        .exec();

      if (!userData) {
        throw new UnauthorizedException('User not found');
      }

      // Validate password
      const isPasswordValid = bcrypt.compareSync(password, userData.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      // Generate JWT tokens
      const payload = { sub: userData.id, email: userData.email };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      // Save refresh token in DB
      await this.UserInstance.update({ id: userData.id }, { refreshToken });

      // Return response
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

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const [userData] = await this.UserInstance.scan()
        .where('email')
        .eq(decoded.email)
        .exec();

      if (!userData || userData.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const payload = { sub: userData.id, email: userData.email };
      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    // Fetch user by ID
    const user = await this.UserInstance.get(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify old password
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    // Hash and update new password
    const hashedNewPassword = bcrypt.hashSync(newPassword, 8);
    await this.UserInstance.update(
      { id: userId },
      { password: hashedNewPassword },
    );

    return { message: 'Password updated successfully' };
  }

  async logout(refreshToken: string) {
    const user = await this.UserInstance.scan('refreshToken')
      .eq(refreshToken)
      .exec();
    if (!user || user.count === 0) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userRecord = user[0];

    // Check if refreshToken exists and set it to null
    userRecord.refreshToken = '';

    await this.UserInstance.update(userRecord);

    return { message: 'Logout successful' };
  }
}
