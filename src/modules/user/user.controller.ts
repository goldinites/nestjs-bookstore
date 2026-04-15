import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/entities/user.entity';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/user/enums/roles.enum';
import { GetUserReqDto } from '@/modules/user/dto/get-user.dto';
import { GetUsersResponse, UserResponse } from '@/modules/user/types/user.type';
import {
  mapUsersToResponse,
  mapUserToResponse,
} from '@/modules/user/mappers/user-to-response.mapper';
import { UserErrors } from '@/modules/user/enums/errors.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Permissions(Roles.ADMIN)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Query() query: GetUserReqDto): Promise<GetUsersResponse> {
    const { content, total } = await this.userService.getUsers(query);

    return { content: mapUsersToResponse(content), total };
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponse | null> {
    const user: User | null = await this.userService.getUserById(id);

    if (!user) throw new NotFoundException(UserErrors.NOT_FOUND);

    return mapUserToResponse(user);
  }

  @Post()
  async createUser(@Body() payload: CreateUserDto): Promise<UserResponse> {
    const user: User = await this.userService.createUser(payload);

    return mapUserToResponse(user);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<UserResponse | null> {
    const user: User | null = await this.userService.updateUser(
      id,
      payload,
      Roles.ADMIN,
    );

    if (!user) throw new BadRequestException(UserErrors.NOT_UPDATED);

    return mapUserToResponse(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.userService.deleteUser(id);
  }
}
