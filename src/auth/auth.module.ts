import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthenticationService } from './domain/services/auth.service';
import { UsersService } from './domain/services/users.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './domain/strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './infrastructure/entities/user.entity';
import { JwtStrategy } from './domain/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthenticationService, UsersService, LocalStrategy, JwtStrategy],
  exports: [TypeOrmModule],
})
export class AuthModule {}
