import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { NextFunction, Request ,Response} from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false, 
  });
 
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (
      req.path.startsWith('/api') || // API routes
      req.path.startsWith('/docs')   // Swagger UI
    ) {
      next(); // Let NestJS handle these routes
    } else {
      // Serve React's index.html for all other routes
      res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    }
  });
  app.setBaseViewsDir(join(__dirname, '..', 'public'));
  app.setGlobalPrefix('api');
  app.setViewEngine('html');
  app.enableCors({
    origin: '*',
    credentials: true,
  });

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
