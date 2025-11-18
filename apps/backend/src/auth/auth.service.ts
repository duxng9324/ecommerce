import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: {email: dto.email},
    });

    if(exists) throw new BadRequestException('Email already exists');

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hash,
      }
    })

    return this.generateToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {email: dto.email}
    });

    if(!user) throw new BadRequestException('User not found');

    const match = await bcrypt.compare(dto.password, user.password);

    if(!match) throw new BadRequestException("Wrong password");

    return this.generateToken(user.id, user.email, user.role);
  }

  generateToken(id: string, email: string, role: string) {
    return {
      access_token: this.jwt.sign({id, email, role})
    };
  }
}
