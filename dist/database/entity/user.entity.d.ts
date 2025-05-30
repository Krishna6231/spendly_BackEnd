import { Item } from "dynamoose/dist/Item";
export declare class UserEntity extends Item {
    id: string;
    email: string;
    name: string;
    password: string;
    refreshToken?: string;
}
