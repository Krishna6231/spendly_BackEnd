import { Item } from "dynamoose/dist/Item";

export class UserEntity extends Item{
    id: string;
    email: string;
    name: string;
    password: string;
    refreshToken?: string;
    expoPushToken?: string;
    rp_token?:string;
    rp_token_expiry?: number; 
  }
  