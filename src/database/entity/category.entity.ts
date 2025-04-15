import { Item } from "dynamoose/dist/Item";

export class CategoryEntity extends Item {
  userid: string;
  categories?: string[];
}
