import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService
  ){}

  async getAllUser () {
    return await this.prisma.user.findMany({
      select: {id: true, name: true, role: true, email: true}
    });
  }

  async getUserByEmail (email: string) {
    const user = await this.prisma.user.findUnique({
      where: {email: email},
      select: {id: true, name: true, role: true, email: true}
    });

    if(!user) throw new BadRequestException("User not found");

    return user;
  }

  async getUserById (id: string) {
    const user = await this.prisma.user.findUnique({
      where: {id},
      select: {id: true, name: true, role: true, email: true}
    });

    if(!user) throw new BadRequestException("User not found");

    return user;
  }

  async createUser (data: {name: string,role: string, email: string, password: string}) {
    const user = await this.prisma.user.findUnique({
      where: {email: data.email},
    });

    if(user) throw new BadRequestException("Email already exists");

    const hash = await bcrypt.hash(data.password, 10);

    const newUser = this.prisma.user.create({
      data: {
        name: data.name,
        role: data.role,
        email: data.email,
        password: hash
      },
      select: {id: true, name: true, role: true, email: true}
    })

    return newUser;
  }

  async updateUser (id: string, data: {name?: string, email?: string, role?: string}) {
    const user = await this.prisma.user.findUnique({
      where: {id}
    })

    if(!user) throw new BadRequestException("User not found");

    const updateUser = await this.prisma.user.update({
      where: {id},
      data: data,
      select: {id: true, name: true, role: true, email: true}
    })

    return updateUser;
  }

  async deleteUser (id: string) {
    const user = await this.prisma.user.findUnique({
      where: {id}
    });

    if(!user) throw new BadRequestException("User not found");

    await this.prisma.user.delete({
      where: {id: user.id}
    })

    return({message: "Deleted"})
  }
}
