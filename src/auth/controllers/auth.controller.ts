import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { AuthenticationService } from '../domain/services/auth.service';
import { LocalAuthenticationGuard } from '../guards/local-auth-guard';
import { RegisterDto } from '../dto/create-user.dto';
import { RequestWithUser } from '../request-user.interface';
import { Response } from 'express';
import JwtAuthenticationGuard from '../guards/jwt-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return await this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser) {
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return {};
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('me')
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
