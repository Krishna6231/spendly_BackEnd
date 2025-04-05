import * as AWS from 'aws-sdk';
import * as dynamoose from 'dynamoose';
import * as dotenv from 'dotenv';

dotenv.config(); // Load from .env

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_AUTH_BACKEND_REGION,
});

// You can also configure other options like local if you're using local DynamoDB

console.log('✅ Dynamoose configured with region:', process.env.AWS_REGION);

export default dynamoose;
