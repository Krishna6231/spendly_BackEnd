"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const dynamoose = require("dynamoose");
const uuid_1 = require("uuid");
exports.UserSchema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
        default: uuid_1.v4,
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: false,
        default: '',
    },
});
//# sourceMappingURL=user.schema.js.map