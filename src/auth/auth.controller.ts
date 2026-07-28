import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { SignUpDto } from './dto/signUp.dto';
import { COOKIE_OPTIONS } from '../common/constants';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('user-info')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated user',
    schema: {
      example: {
        id: 2,
        name: 'John Doe',
        email: 'johndoe@mail.com',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized user',
      },
    },
  })
  async getUserInfo(@Req() req: Request) {
    const id = req.user.sub;
    if (!id) {
      throw new UnauthorizedException('Unauthorized user');
    }
    return this.authService.getUser(id);
  }

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        id: 2,
        name: 'John Doe',
        email: 'johndoe@email.com',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      example: {
        message: ['email must be an email', 'phone must be a string'],
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict credentials',
    schema: {
      example: {
        message: 'Email already exists',
      },
    },
  })
  async register(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signUp(signUpDto);
    res.cookie('access_token', result.access_token, COOKIE_OPTIONS);

    return result.user;
  }

  @Get('logout')
  @ApiResponse({
    status: 200,
    description: 'Logged out',
    schema: {
      example: {
        message: 'Logged Out',
      },
    },
  })
  logOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return {
      message: 'Logged out',
    };
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 2,
        email: 'johndoe@mail.com',
        name: 'John Doe',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
      },
    },
  })
  async login(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(signInDto);

    res.cookie('access_token', result.access_token, COOKIE_OPTIONS);

    return result.user;
  }
}
