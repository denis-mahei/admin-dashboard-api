import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<{
    access_token: string;
    user: { id: number; email: string; name: string };
  }> {
    const isExist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (isExist) {
      throw new ConflictException('Email already exists');
    }
    const secret = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: secret,
        name: dto.name,
        phone: dto.phone,
      },
    });

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwt.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async signIn(signInDto: SignInDto): Promise<{
    access_token: string;
    user: { id: number; email: string; name: string };
  }> {
    const user = await this.prisma.user.findUnique({
      where: { email: signInDto.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwt.sign(payload),
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
  async getUser(
    id: number,
  ): Promise<{ id: number; name: string; email: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
