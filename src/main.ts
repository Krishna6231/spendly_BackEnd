import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (optional, but useful for frontend)
  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Spendly API') // Change as needed
    .setDescription('API documentation for Spendly app')
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT Authentication in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`🚀 Server running at: http://localhost:3000/api/docs`);
}
bootstrap();
