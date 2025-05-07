export default () => ({
    host: process.env.SERVER_HOST,
    port: parseInt(process.env.PORT, 10) || 2930,
    aws_access_key: process.env.AWS_AUTH_BACKEND_ACCESS_KEY,
    aws_secret_key: process.env.AWS_AUTH_BACKEND_SECRET_ACCESS_KEY,
    aws_region: process.env.AWS_AUTH_BACKEND_REGION,
  });