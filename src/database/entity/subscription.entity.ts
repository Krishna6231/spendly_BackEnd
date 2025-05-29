import { Item } from "dynamoose/dist/Item";

export class SubscriptionEntity extends Item {
  id: string;
  user_id: string;
  subscription: string;
  amount: number;
  autopay_date: number;
}