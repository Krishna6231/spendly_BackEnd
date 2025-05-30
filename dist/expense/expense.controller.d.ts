import { ExpenseService } from './expense.service';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    addExpense(data: any): Promise<import("../database/entity/expense.entity").ExpenseEntity>;
    getExpensesByUserId(userid: string): Promise<any>;
    addCategory(body: {
        user_id: string;
        category: string;
        limit: number;
        color: string;
    }): Promise<{
        id: string;
        user_id: string;
        category: string;
        limit: number;
        color: string;
        conformToSchema: (this: import("dynamoose/dist/Item").Item, settings?: import("dynamoose/dist/Item").ItemObjectFromSchemaSettings) => Promise<import("dynamoose/dist/Item").Item>;
        toDynamo: (this: import("dynamoose/dist/Item").Item, settings?: Partial<import("dynamoose/dist/Item").ItemObjectFromSchemaSettings>) => Promise<any>;
    }>;
    deleteCategory(body: {
        user_id: string;
        category: string;
    }): Promise<{
        message: string;
        category: string;
    }>;
    editCategoryLimit(body: {
        user_id: string;
        category: string;
        limit: number;
        color: string;
    }): Promise<{
        id: string;
        user_id: string;
        category: string;
        limit: number;
        color: string;
        conformToSchema: (this: import("dynamoose/dist/Item").Item, settings?: import("dynamoose/dist/Item").ItemObjectFromSchemaSettings) => Promise<import("dynamoose/dist/Item").Item>;
        toDynamo: (this: import("dynamoose/dist/Item").Item, settings?: Partial<import("dynamoose/dist/Item").ItemObjectFromSchemaSettings>) => Promise<any>;
    }>;
    deleteExpense(expenseId: string, userId: string): Promise<{
        message: string;
    }>;
    addSubscription(body: {
        user_id: string;
        subscription: string;
        amount: number;
        autopay_date: number;
    }): Promise<{
        id: string;
        user_id: string;
        subscription: string;
        amount: number;
        autopay_date: number;
        conformToSchema: (this: import("dynamoose/dist/Item").Item, settings?: import("dynamoose/dist/Item").ItemObjectFromSchemaSettings) => Promise<import("dynamoose/dist/Item").Item>;
        toDynamo: (this: import("dynamoose/dist/Item").Item, settings?: Partial<import("dynamoose/dist/Item").ItemObjectFromSchemaSettings>) => Promise<any>;
    }>;
    deleteSubscription(body: {
        user_id: string;
        subscription: string;
    }): Promise<{
        message: string;
        subscription: string;
    }>;
    editSubscription(body: {
        user_id: string;
        subscription: string;
        amount: number;
        autopay_date: number;
    }): Promise<{
        id: string;
        user_id: string;
        subscription: string;
        amount: number;
        autopay_date: number;
        conformToSchema: (this: import("dynamoose/dist/Item").Item, settings?: import("dynamoose/dist/Item").ItemObjectFromSchemaSettings) => Promise<import("dynamoose/dist/Item").Item>;
        toDynamo: (this: import("dynamoose/dist/Item").Item, settings?: Partial<import("dynamoose/dist/Item").ItemObjectFromSchemaSettings>) => Promise<any>;
    }>;
}
