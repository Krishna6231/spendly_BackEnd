"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseSchema = void 0;
const dynamoose = require("dynamoose");
const uuid_1 = require("uuid");
exports.ExpenseSchema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
        default: uuid_1.v4,
    },
    userid: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    note: {
        type: String,
        required: false,
    }
}, {
    timestamps: {
        createdAt: ['createDate', 'creation'],
        updatedAt: ['updateDate', 'updated'],
    },
});
//# sourceMappingURL=expense.schema.js.map