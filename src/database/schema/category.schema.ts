import * as dynamoose from 'dynamoose';

export const CategorySchema = new dynamoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    schema: [String],
    required: false,
    default: ["Food", "Medicine", "Entertainment", "Travel"],
  },
});
