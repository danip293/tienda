import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

// Modules
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
// import { OrdersModule } from './orders/orders.module';
// import { DiscountsModule } from './discounts/discounts.module';
// import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_USERNAME: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        // jwt
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      /* A feature of TypeORM that will automatically create the database tables for you. */
      synchronize: true, // disable to production
      entities: ['dist/**/*.entity.{js,ts}'],
      // subscribers: ['d782052ist/**/*.subscriber.{js,ts}'],
      logging: 'all',
    }),
    ProductsModule,
    AuthModule,
    // CategoriesModule,
    // OrdersModule,
    // DiscountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
