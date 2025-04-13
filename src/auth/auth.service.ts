import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../database/entity/user.entity';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { Model } from 'dynamoose/dist/Model';
import { UserSchema } from 'src/database/schema/user.schema';

@Injectable()
export class AuthService {
  private UserInstance: Model<UserEntity>;

  constructor(private jwtService: JwtService) {
    this.UserInstance = dynamoose.model<UserEntity>('Users', UserSchema);
  }

  async signup(email: string, password: string) {
    const existing = await this.UserInstance.scan({ email }).exec();

    if (existing.count > 0) {
      throw new ConflictException('User already exists');
    }

    const newUser = await this.UserInstance.create({
      email,
      password: bcrypt.hashSync(password, 8),
    });

    return {...newUser};
  }

  async login(email: string, password: string) {
    try {
      console.log('Login attempt started.');
      console.log('Email:', email);
      console.log('Password:', password);
  
      // Check if user exists
      const [userData] = await this.UserInstance.scan().where('email').eq(email).exec();
      console.log('User data retrieved:', userData);
  
      if (!userData) {
        console.log('User not found for email:', email);
        throw new UnauthorizedException('User not found');
      }
  
      // Validate password
      const isPasswordValid = bcrypt.compareSync(password, userData.password);
      console.log('Is password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('Invalid password for email:', email);
        throw new UnauthorizedException('Invalid password');
      }
  
      // Generate JWT tokens
      const payload = { sub: userData.id, email: userData.email };
      console.log('JWT Payload:', payload);
  
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
      console.log('Generated accessToken:', accessToken);
      console.log('Generated refreshToken:', refreshToken);
  
      // Save refresh token in DB
      console.log('Updating user with refreshToken for email:', email);
      await this.UserInstance.update({ id: userData.id }, { refreshToken });
      console.log('User refreshToken updated in DB.');
  
      // Return response
      return {
        user: {
          id: userData.id,
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

      const [userData] = await this.UserInstance.scan().where('email').eq(decoded.email).exec();

      if (!userData || userData.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const payload = { sub: userData.id, email: userData.email };
      const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string) {
    console.log("rr", refreshToken);
    const user = await this.UserInstance.scan('refreshToken').eq(refreshToken).exec();
    if (!user || user.count === 0) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  
    const userRecord = user[0];
    
    // Check if refreshToken exists and set it to null
    userRecord.refreshToken = '';

    // Log the user record to debug
    console.log("Updating user with null refreshToken", userRecord);

    await this.UserInstance.update(userRecord);

    return { message: 'Logout successful' };
}
}
