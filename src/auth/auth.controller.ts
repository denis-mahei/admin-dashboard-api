import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { SignUpDto } from './dto/signUp.dto';
import { COOKIE_OPTIONS } from '../common/constants';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('user-info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req: Request) {
    const id = req.user.sub;
    return this.authService.getUser(id);
  }

  @Post('register')
  async register(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signUp(signUpDto);
    res.cookie('access_token', result.access_token, COOKIE_OPTIONS);

    return result.user;
  }

  @Get('logout')
  logOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return {
      message: 'Logged out',
    };
  }

  @Post('login')
  async login(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    res.cookie('access_token', result.access_token, COOKIE_OPTIONS);

    return result.user;
  }
}
