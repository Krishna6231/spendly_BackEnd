"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const dynamoose = require("dynamoose");
const expense_schema_1 = require("../database/schema/expense.schema");
const uuid_1 = require("uuid");
const user_schema_1 = require("../database/schema/user.schema");
const category_schema_1 = require("../database/schema/category.schema");
const subscription_schema_1 = require("../database/schema/subscription.schema");
const ExpenseModel = dynamoose.model('Expense', expense_schema_1.ExpenseSchema);
const UserModel = dynamoose.model('Users', user_schema_1.UserSchema);
const CategoryModel = dynamoose.model('Categories', category_schema_1.CategorySchema);
const SubscriptionModel = dynamoose.model('Subscriptions', subscription_schema_1.SubscriptionSchema);
let ExpenseService = class ExpenseService {
    async addExpense(data) {
        const user = await UserModel.get(data.id);
        if (!user) {
            throw new Error('User ID not found');
        }
        const expense = new ExpenseModel({
            id: (0, uuid_1.v4)(),
            userid: data.id,
            category: data.category,
            amount: data.amount,
            date: data.date,
            note: data.note,
        });
        return (await expense.save());
    }
    async getExpensesByUserId(userid) {
        const expenses = await ExpenseModel.scan({ userid }).exec();
        const categoryItems = await CategoryModel.scan({ user_id: userid }).exec();
        const subItems = await SubscriptionModel.scan({ user_id: userid }).exec();
        const categories = categoryItems.map((item) => ({
            category: item.category,
            limit: item.limit,
            color: item.color,
        }));
        const subscriptions = subItems.map((item) => ({
            subscription: item.subscription,
            amount: item.amount,
            autopay_date: item.autopay_date,
        }));
        return { expenses, categories, subscriptions };
    }
    async addCategory(user_id, category, limit, color) {
        try {
            const newCategory = await CategoryModel.create({
                user_id,
                category,
                limit,
                color,
            });
            return { ...newCategory };
        }
        catch (error) {
            console.error('Error while adding category:', error);
            throw new Error('Error while adding category');
        }
    }
    async addSubscription(user_id, subscription, amount, autopay_date) {
        try {
            const newSubscription = await SubscriptionModel.create({
                user_id,
                subscription,
                amount,
                autopay_date,
            });
            return { ...newSubscription };
        }
        catch (error) {
            console.error('Error while adding subscription:', error);
            throw new Error('Error while adding subscription');
        }
    }
    async deleteCategory(user_id, category) {
        try {
            const result = await CategoryModel.scan({
                user_id: { eq: user_id },
                category: { eq: category },
            }).exec();
            if (result.count === 0) {
                throw new Error('Category not found.');
            }
            const categoryItem = result[0];
            await CategoryModel.delete(categoryItem.id);
            return { message: 'Category deleted successfully.', category };
        }
        catch (error) {
            console.error('Error deleting category:', error);
            throw new Error('Failed to delete category.');
        }
    }
    async deleteSubscription(user_id, subscription) {
        try {
            const result = await SubscriptionModel.scan({
                user_id: { eq: user_id },
                subscription: { eq: subscription },
            }).exec();
            if (result.count === 0) {
                throw new Error('Subscription not found.');
            }
            const subItem = result[0];
            await SubscriptionModel.delete(subItem.id);
            return { message: 'Subscription deleted successfully.', subscription };
        }
        catch (error) {
            console.error('Error deleting subscription:', error);
            throw new Error('Failed to delete subscription.');
        }
    }
    async editCategoryLimit(user_id, category, limit, color) {
        try {
            const user = await UserModel.scan({ id: user_id }).exec();
            if (!user || user.length === 0) {
                throw new Error('User not found');
            }
            const categoryItem = await CategoryModel.scan({
                user_id,
                category,
            }).exec();
            if (!categoryItem || categoryItem.length === 0) {
                throw new Error('Category not found for this user');
            }
            const updated = await CategoryModel.update({ id: categoryItem[0].id }, { limit, color });
            return { ...updated };
        }
        catch (error) {
            console.error('Error while editing category limit:', error);
            throw new Error('Error while editing category limit');
        }
    }
    async editSubscription(user_id, subscription, amount, autopay_date) {
        try {
            const user = await UserModel.scan({ id: user_id }).exec();
            if (!user || user.length === 0) {
                throw new Error('User not found');
            }
            const subItem = await SubscriptionModel.scan({
                user_id,
                subscription,
            }).exec();
            if (!subItem || subItem.length === 0) {
                throw new Error('Subscription not found for this user');
            }
            const updated = await SubscriptionModel.update({ id: subItem[0].id }, { amount, autopay_date });
            return { ...updated };
        }
        catch (error) {
            console.error('Error while editing subscription:', error);
            throw new Error('Error while editing subscription');
        }
    }
    async deleteExpense(expenseId, userId) {
        try {
            const expense = await ExpenseModel.get(expenseId);
            if (!expense) {
                throw new Error('Expense not found');
            }
            if (expense.userid !== userId) {
                throw new Error('Unauthorized: This expense does not belong to the user');
            }
            await ExpenseModel.delete(expenseId);
            return { message: 'Expense deleted successfully' };
        }
        catch (error) {
            console.error('Error while deleting expense:', error);
            throw new Error('Error while deleting expense');
        }
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)()
], ExpenseService);
//# sourceMappingURL=expense.service.js.map