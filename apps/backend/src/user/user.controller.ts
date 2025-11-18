import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt_auth.guard';
import { UserService } from './user.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** GET ALL USER */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get()
  async getAllUser() {
    return this.userService.getAllUser();
  }

  /** GET BY EMAIL */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('email')
  async getUserByEmail(@Query('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  /** GET BY ID */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  /** CREATE USER */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  async createUser(@Body() data: { name: string; role: string; email: string; password: string }) {
    return this.userService.createUser(data);
  }

  /** UPDATE USER */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: { name?: string; email?: string; role?: string },
  ) {
    return this.userService.updateUser(id, data);
  }

  /** DELETE USER */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
