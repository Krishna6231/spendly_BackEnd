import * as dynamoose from 'dynamoose';
import {v4 as uuidv4} from 'uuid';

export const CategorySchema = new dynamoose.Schema(
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
  }
);
