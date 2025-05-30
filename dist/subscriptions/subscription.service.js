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
var SubscriptionCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const dynamoose = require("dynamoose");
const expense_schema_1 = require("../database/schema/expense.schema");
const subscription_schema_1 = require("../database/schema/subscription.schema");
const uuid_1 = require("uuid");
let SubscriptionCronService = SubscriptionCronService_1 = class SubscriptionCronService {
    constructor() {
        this.logger = new common_1.Logger(SubscriptionCronService_1.name);
        this.SubscriptionModel = dynamoose.model('Subscriptions', subscription_schema_1.SubscriptionSchema);
        this.ExpenseModel = dynamoose.model('Expense', expense_schema_1.ExpenseSchema);
    }
    async handleAutoExpenses() {
        const today = new Date().getDate();
        try {
            const subscriptions = await this.SubscriptionModel.scan().exec();
            const dueSubs = subscriptions.filter((sub) => sub.autopay_date === today);
            for (const sub of dueSubs) {
                await this.ExpenseModel.create({
                    id: (0, uuid_1.v4)(),
                    userid: sub.user_id,
                    amount: sub.amount,
                    category: 'Subscriptions',
                    note: `${sub.subscription} - Auto Expense`,
                    date: new Date().toISOString(),
                });
                this.logger.log(`Auto expense added for ${sub.subscription} (User: ${sub.user_id})`);
            }
            this.logger.log(`Auto Addition of expenses done!`);
        }
        catch (err) {
            this.logger.error('Error in cron job:', err);
        }
    }
};
exports.SubscriptionCronService = SubscriptionCronService;
__decorate([
    (0, schedule_1.Cron)('0 0 * * *', { timeZone: 'Asia/Kolkata' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionCronService.prototype, "handleAutoExpenses", null);
exports.SubscriptionCronService = SubscriptionCronService = SubscriptionCronService_1 = __decorate([
    (0, common_1.Injectable)()
], SubscriptionCronService);
//# sourceMappingURL=subscription.service.js.map