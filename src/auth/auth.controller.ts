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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('user-info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req) {
    const id = req.user.sub;
    return this.authService.getUser(id);
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
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    } as const;

    res.cookie('access_token', result.access_token, options);

    return result.user;
  }
}
