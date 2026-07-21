import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function startApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Perago Information Systems')
    .setDescription('Organizational Hierarchy API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('positions')
    .addTag('employees')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('API running at http://localhost:3000');
  console.log('Swagger at http://localhost:3000/api');
}
startApp();
