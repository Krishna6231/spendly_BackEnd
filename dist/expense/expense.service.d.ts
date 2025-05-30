import { ExpenseEntity } from '../database/entity/expense.entity';
export declare class ExpenseService {
    addExpense(data: any): Promise<ExpenseEntity>;
    getExpensesByUserId(userid: string): Promise<any>;
    addCategory(user_id: string, category: string, limit: number, color: string): Promise<{
        id: string;
        user_id: string;
        category: string;
        limit: number;
        color: string;
        conformToSchema: (this: import("dynamoose/dist/Item").Item, settings?: import("dynamoose/dist/Item").ItemObjectFromSchemaSettings) => Promise<import("dynamoose/dist/Item").Item>;
        toDynamo: (this: import("dynamoose/dist/Item").Item, settings?: Partial<import("dynamoose/dist/Item").ItemObjectFromSchemaSettings>) => Promise<any>;
    }>;
    addSubscription(user_id: string, subscription: string, amount: number, autopay_date: number): Promise<{
        id: string;
        user_id: string;
        subscription: string;
        amount: number;
        autopay_date: number;
        conformToSchema: (this: import("dynamoose/dist/Item").Item, settings?: import("dynamoose/dist/Item").ItemObjectFromSchemaSettings) => Promise<import("dynamoose/dist/Item").Item>;
        toDynamo: (this: import("dynamoose/dist/Item").Item, settings?: Partial<import("dynamoose/dist/Item").ItemObjectFromSchemaSettings>) => Promise<any>;
    }>;
    deleteCategory(user_id: string, category: string): Promise<{
        message: string;
        category: string;
    }>;
    deleteSubscription(user_id: string, subscription: string): Promise<{
        message: string;
        subscription: string;
    }>;
    editCategoryLimit(user_id: string, category: string, limit: number, color: string): Promise<{
        id: string;
        user_id: string;
        category: string;
        limit: number;
        color: string;
        conformToSchema: (this: import("dynamoose/dist/Item").Item, settings?: import("dynamoose/dist/Item").ItemObjectFromSchemaSettings) => Promise<import("dynamoose/dist/Item").Item>;
        toDynamo: (this: import("dynamoose/dist/Item").Item, settings?: Partial<import("dynamoose/dist/Item").ItemObjectFromSchemaSettings>) => Promise<any>;
    }>;
    editSubscription(user_id: string, subscription: string, amount: number, autopay_date: number): Promise<{
        id: string;
        user_id: string;
        subscription: string;
        amount: number;
        autopay_date: number;
        conformToSchema: (this: import("dynamoose/dist/Item").Item, settings?: import("dynamoose/dist/Item").ItemObjectFromSchemaSettings) => Promise<import("dynamoose/dist/Item").Item>;
        toDynamo: (this: import("dynamoose/dist/Item").Item, settings?: Partial<import("dynamoose/dist/Item").ItemObjectFromSchemaSettings>) => Promise<any>;
    }>;
    deleteExpense(expenseId: string, userId: string): Promise<{
        message: string;
    }>;
}
