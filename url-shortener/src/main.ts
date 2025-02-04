import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Short URL')

    .addBearerAuth()

    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, documentFactory);
  app.use(cookieParser());

  await app.listen(3000, () => console.log('Server running ...'));
}
bootstrap();
