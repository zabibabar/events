import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Patch
} from '@nestjs/common'

import { UserService } from './user.service'
import { User } from './interfaces/user.interface'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdateUserDTO } from './dto/update-user.dto'
import { MongoIdParams } from 'src/shared/dto/mongo-id-params.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return this.userService.createUser(createUserDTO)
  }

  @Get(':id')
  getUserByExternalId(@Param() { id }): Promise<User> {
    return this.userService.getUserByExternalId(id)
  }

  @Patch(':id')
  updateUser(@Param() { id }: MongoIdParams, @Body() updateUserDTO: UpdateUserDTO): Promise<User> {
    return this.userService.updateUser(id, updateUserDTO)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param() { id }: MongoIdParams): Promise<void> {
    return this.userService.deleteUser(id)
  }
}
