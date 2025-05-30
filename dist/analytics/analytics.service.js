"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const dynamoose = require("dynamoose");
const expense_schema_1 = require("../database/schema/expense.schema");
const user_schema_1 = require("../database/schema/user.schema");
const category_schema_1 = require("../database/schema/category.schema");
const ExpenseModel = dynamoose.model('Expense', expense_schema_1.ExpenseSchema);
const UserModel = dynamoose.model('Users', user_schema_1.UserSchema);
const CategoryModel = dynamoose.model('Categories', category_schema_1.CategorySchema);
let AnalyticsService = class AnalyticsService {
    async getAnalyticsByUserId(userid) {
        try {
            const user = await UserModel.get(userid);
            if (!user)
                throw new Error('User ID not found');
            const expenses = await ExpenseModel.scan({ userid }).exec();
            let totalSpent = 0;
            const categoryTotals = {};
            const dateTotals = {};
            const monthlyCategoryTotals = {};
            expenses.forEach((expense) => {
                const amount = expense.amount;
                const category = expense.category;
                const date = new Date(expense.date);
                const dateKey = date.toISOString().split('T')[0];
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                totalSpent += amount;
                categoryTotals[category] = (categoryTotals[category] || 0) + amount;
                dateTotals[dateKey] = (dateTotals[dateKey] || 0) + amount;
                if (!monthlyCategoryTotals[monthKey]) {
                    monthlyCategoryTotals[monthKey] = {};
                }
                monthlyCategoryTotals[monthKey][category] =
                    (monthlyCategoryTotals[monthKey][category] || 0) + amount;
            });
            const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
            const topCategory = sortedCategories[0] || ['N/A', 0];
            const leastCategory = sortedCategories[sortedCategories.length - 1] || [
                'N/A',
                0,
            ];
            const uniqueDates = Object.keys(dateTotals).length;
            const averageDailyExpense = uniqueDates > 0 ? totalSpent / uniqueDates : 0;
            return {
                totalSpent,
                topCategory: { category: topCategory[0], amount: topCategory[1] },
                leastCategory: { category: leastCategory[0], amount: leastCategory[1] },
                averageDailyExpense: Number(averageDailyExpense.toFixed(2)),
                dailyExpenses: Object.entries(dateTotals).map(([date, amount]) => ({
                    date,
                    amount,
                })),
                monthlyCategoryExpenses: monthlyCategoryTotals,
            };
        }
        catch (error) {
            console.error('Error while fetching analytics:', error);
            throw new Error('Error while fetching analytics');
        }
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)()
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map