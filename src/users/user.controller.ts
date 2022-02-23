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
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return this.userService.createUser(createUserDTO)
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.getAllUsers()
  }

  @Get(':id')
  findOne(@Param() { id }: MongoIdParams): Promise<User> {
    return this.userService.getUser(id)
  }

  @Patch(':id')
  update(@Param() { id }: MongoIdParams, @Body() updateUserDTO: UpdateUserDTO): Promise<User> {
    return this.userService.updateUser(id, updateUserDTO)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() { id }: MongoIdParams): Promise<void> {
    return this.userService.deleteUser(id)
  }
}
