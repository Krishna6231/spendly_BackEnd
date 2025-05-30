"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const dynamoose = require("dynamoose");
const uuid_1 = require("uuid");
exports.CategorySchema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
        default: uuid_1.v4,
    },
    user_id: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    limit: {
        type: Number,
        required: false,
        default: 1000,
    },
    color: {
        type: String,
        required: true,
    }
});
//# sourceMappingURL=category.schema.js.map