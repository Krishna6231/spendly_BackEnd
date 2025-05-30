"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const dynamoose = require("dynamoose");
const config_1 = require("@nestjs/config");
const dotenv = require("dotenv");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Spendly API')
        .setDescription('API documentation for Spendly app')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const configService = app.get(config_1.ConfigService);
    const ddb = new dynamoose.aws.ddb.DynamoDB({
        credentials: {
            accessKeyId: configService.get('aws_access_key'),
            secretAccessKey: configService.get('aws_secret_key'),
        },
        region: configService.get('aws_region'),
    });
    dynamoose.aws.ddb.set(ddb);
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Documentation at: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map