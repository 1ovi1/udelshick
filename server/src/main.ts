import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_PORT } from '@constants';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { configureApplication } from './bootstrap/configure-application';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApplication(app);

  const config = new DocumentBuilder()
    .setTitle('API Удельщика')
    .setDescription('Описание rest api для сервера учебного проекта "Удельщик"')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(APP_PORT);
  console.log('Running on port ==> ', APP_PORT);
  console.log(
    'Swagger docs available at http://localhost:' + APP_PORT + '/api/docs',
  );
}
bootstrap();
