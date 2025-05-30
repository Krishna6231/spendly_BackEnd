"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const common_1 = require("@nestjs/common");
const expense_service_1 = require("./expense.service");
let ExpenseController = class ExpenseController {
    constructor(expenseService) {
        this.expenseService = expenseService;
    }
    async addExpense(data) {
        return this.expenseService.addExpense(data);
    }
    async getExpensesByUserId(userid) {
        return this.expenseService.getExpensesByUserId(userid);
    }
    async addCategory(body) {
        const { user_id, category, limit, color } = body;
        return this.expenseService.addCategory(user_id, category, limit, color);
    }
    async deleteCategory(body) {
        const { user_id, category } = body;
        return this.expenseService.deleteCategory(user_id, category);
    }
    async editCategoryLimit(body) {
        return this.expenseService.editCategoryLimit(body.user_id, body.category, body.limit, body.color);
    }
    async deleteExpense(expenseId, userId) {
        return this.expenseService.deleteExpense(expenseId, userId);
    }
    async addSubscription(body) {
        const { user_id, subscription, amount, autopay_date } = body;
        return this.expenseService.addSubscription(user_id, subscription, amount, autopay_date);
    }
    async deleteSubscription(body) {
        const { user_id, subscription } = body;
        return this.expenseService.deleteSubscription(user_id, subscription);
    }
    async editSubscription(body) {
        return this.expenseService.editSubscription(body.user_id, body.subscription, body.amount, body.autopay_date);
    }
};
exports.ExpenseController = ExpenseController;
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "addExpense", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Query)('userid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getExpensesByUserId", null);
__decorate([
    (0, common_1.Post)('add-category'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "addCategory", null);
__decorate([
    (0, common_1.Post)('delete-category'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Put)('edit-category'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "editCategoryLimit", null);
__decorate([
    (0, common_1.Delete)('delete'),
    __param(0, (0, common_1.Query)('expenseId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "deleteExpense", null);
__decorate([
    (0, common_1.Post)('add-subscription'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "addSubscription", null);
__decorate([
    (0, common_1.Post)('delete-subscription'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "deleteSubscription", null);
__decorate([
    (0, common_1.Put)('edit-subscription'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "editSubscription", null);
exports.ExpenseController = ExpenseController = __decorate([
    (0, common_1.Controller)('expense'),
    __metadata("design:paramtypes", [expense_service_1.ExpenseService])
], ExpenseController);
//# sourceMappingURL=expense.controller.js.map