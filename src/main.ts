import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dynamoose from 'dynamoose';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Spendly API') // Change as needed
    .setDescription('API documentation for Spendly app')
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT Authentication in Swagger UI
    .build();

  const configService = app.get<ConfigService>(ConfigService);
  const ddb = new dynamoose.aws.ddb.DynamoDB({
    credentials: {
      accessKeyId: configService.get('aws_access_key'),
      secretAccessKey: configService.get('aws_secret_key'),
    },
    region: configService.get('aws_region'),
  });

  // Set DynamoDB instance to the Dynamoose DDB instance
  dynamoose.aws.ddb.set(ddb);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Documentation at: http://localhost:${port}/api/docs`);
}
bootstrap();
