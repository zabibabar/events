import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common'

import { UsersService } from './user.service'
import { User } from './interfaces/user.interface'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdateUserDTO } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return this.usersService.createUser(createUserDTO)
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.getAllUsers()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser(id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO): Promise<void> {
    return this.usersService.updateUser(id, updateUserDTO)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id)
  }
}
