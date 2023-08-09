import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Req,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { LocalAuthenticationGuard } from './local-auth-gard';
import { RegisterDto } from './dto/create-user.dto';
import { RequestWithUser } from './request-user.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }
}
