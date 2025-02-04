import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false, 
  });
  app.setBaseViewsDir(join(__dirname, '..', 'public'));
  
  app.setViewEngine('html');
  app.enableCors({
    origin: '*',
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

  await app.listen(process.env.PORT || 3000, () =>
    console.log('Server running ...'),
  );
}
bootstrap();
