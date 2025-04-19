import { Item } from "dynamoose/dist/Item";

export class CategoryEntity extends Item {
  id: string;
  user_id: string;
  category: string;
  limit: number;
}