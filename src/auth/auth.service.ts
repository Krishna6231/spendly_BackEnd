
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
// import { v4 as uuidv4 } from 'uuid';
import {UserEntity} from '../database/entity/user.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { Model } from 'dynamoose/dist/Model';
import { UserSchema } from 'src/database/schema/user.schema';
import {
    InternalServerErrorException
} from "@nestjs/common";
@Injectable()
export class AuthService {
  private UserInstance: Model<UserEntity>;

  constructor(private jwtService: JwtService) {
    this.UserInstance = dynamoose.model<UserEntity>('Users',UserSchema);

  }

  async signup(email: string, password: string) {
    const existing = await this.UserInstance
    .scan({email: email}).exec();

    if (existing.count > 0) { throw new ConflictException('User already exists'); }

    const newUser = await this.UserInstance.create({
        
        email: email,
        
        password: bcrypt.hashSync(password, 8),
        
      });
      return {...newUser}
    
  }

  async login(email: string, password: string) {

    try {
        const [userData] = await this.UserInstance
          .scan()
          .where("email")
          .eq(email)
          .exec();
        if (!userData) {
          return {
            status: 404,
            message: "User not found",
          };
        }
        if (!bcrypt.compareSync(password, userData.password)) {
          return {
            status: 500,
            message: "Invalid password",
          };
        }
        return await this.UserInstance.get(userData.id);
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
  }
  
}
