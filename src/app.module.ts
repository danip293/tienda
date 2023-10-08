import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

// Modules
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { OrdersModule } from './orders/orders.module';
// import { DiscountsModule } from './discounts/discounts.module';
// import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import LogsMiddleware from './common/middlewares/registros.middleware';
import { ChatModule } from './chat/chat.module';
// import DatabaseLogger from './common/database.logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_USERNAME: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        // jwt
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // logger: new DatabaseLogger(),
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        autoLoadEntities: true,
        /* A feature of TypeORM that will automatically create the database tables for you. */
        synchronize: true, // disable to production
        entities: ['dist/**/*.entity.{js,ts}'],
        // subscribers: ['d782052ist/**/*.subscriber.{js,ts}'],
        logging: 'all',
      }),
    }),
    ProductsModule,
    AuthModule,
    ChatModule,
    // CategoriesModule,
    // OrdersModule,
    // DiscountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
