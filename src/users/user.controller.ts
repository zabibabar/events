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
import { Group } from 'src/groups/interfaces/group.interface'
import { Event } from 'src/events/interfaces/event.interface'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers()
  }

  @Post()
  createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return this.userService.createUser(createUserDTO)
  }

  @Get(':id')
  findOneUser(@Param() { id }: MongoIdParams): Promise<User> {
    return this.userService.getUser(id)
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

  @Get(':id/groups')
  getGroupsByUser(@Param() { id }: MongoIdParams): Promise<Group[]> {
    return this.userService.getGroupsByUser(id)
  }

  @Get(':id/events')
  getEventsByUser(@Param() { id }: MongoIdParams): Promise<Event[]> {
    return this.userService.getEventsByUser(id)
  }
}
