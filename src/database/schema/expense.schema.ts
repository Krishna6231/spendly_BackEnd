import * as dynamoose from 'dynamoose';
import {v4 as uuidv4} from 'uuid';

export const ExpenseSchema = new dynamoose.Schema({
    id: {
      type: String,
      hashKey: true,
      default: uuidv4,
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
      type: String, // changed from String to Number
      required: false,
    },
    date: {
      type: String, // assumed ISO string, e.g., "2025-04-13"
      required: false,
    },
  }, {
    timestamps: {
      createdAt: ['createDate', 'creation'],
      updatedAt: ['updateDate', 'updated'],
    },
  });
  