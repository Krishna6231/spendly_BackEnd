import { Item } from "dynamoose/dist/Item";

export class ExpenseEntity extends Item {
  id: string;
  userid: string;
  category: string;
  amount: number;
  date: string;
}
