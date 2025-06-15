import * as dynamoose from 'dynamoose';

export const LendBorrowSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  user_id: {
      type: String,
      required: true,
      index: {
        name: 'userid-index',
        type: 'global'
      },
    },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Lent', 'Borrow'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  installment: {
    type: Array,
    schema: [
      {
        type: Object,
        schema: {
          amount: Number,
          date: String,
        },
      },
    ],
    default: [],
  },
});
