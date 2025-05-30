import { Item } from "dynamoose/dist/Item";
export declare class ExpenseEntity extends Item {
    id: string;
    userid: string;
    category: string;
    amount: number;
    date: string;
    note: string;
}
