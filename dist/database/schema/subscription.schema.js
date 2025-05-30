"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionSchema = void 0;
const dynamoose = require("dynamoose");
const uuid_1 = require("uuid");
exports.SubscriptionSchema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
        default: uuid_1.v4,
    },
    user_id: {
        type: String,
        required: true,
    },
    subscription: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    autopay_date: {
        type: Number,
        required: true,
    }
});
//# sourceMappingURL=subscription.schema.js.map