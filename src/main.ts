import { NestFactory, HttpAdapterHost, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ExcludeNullInterceptor } from './common/interceptors/exclude-null.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, //automatic type convertion
      },
    }),
  );

  // app.useGlobalFilters(
  //   new HttpExceptionFilter(),
  //   new AllExceptionsFilter(httpAdapter),
  // );
  // app.useGlobalInterceptors(new WrapResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ExcludeNullInterceptor());

  // swagger config
  const options = new DocumentBuilder()
    .setTitle('tienda api')
    .setDescription('Tienda application')
    .setVersion('1.0')
    .build();
  const documet = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, documet);

  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
