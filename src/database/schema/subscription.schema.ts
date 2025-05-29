import * as dynamoose from 'dynamoose';
import {v4 as uuidv4} from 'uuid';

export const SubscriptionSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey : true,
      default: uuidv4,
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
  }
);
