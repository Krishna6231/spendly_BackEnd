import { Item } from "dynamoose/dist/Item";

export class UserEntity extends Item{
    id: string;
    email: string;
    password: string;
  }