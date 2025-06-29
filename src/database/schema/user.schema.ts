import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const UserSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  email: {
    type: String,
    required: true,
    index: {
      name: 'email-index',
      type: 'global',
      project: true,
    },
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: false,
    default: '',
  },
  expoPushToken: {
    type: String,
    required: false,
  },
  rp_token: {
    type: String,
    required: false,
  },
  rp_token_expiry: {
    type: Number,
    required: false,
  },
});
