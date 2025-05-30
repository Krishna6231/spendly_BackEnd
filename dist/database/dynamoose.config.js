"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const dynamoose = require("dynamoose");
const dotenv = require("dotenv");
dotenv.config();
AWS.config.update({
    region: process.env.AWS_AUTH_BACKEND_REGION,
});
console.log('✅ Dynamoose configured with region:', process.env.AWS_REGION);
exports.default = dynamoose;
//# sourceMappingURL=dynamoose.config.js.map