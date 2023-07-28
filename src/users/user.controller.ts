import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'

import { UserService } from './user.service'
import { User } from './interfaces/user.interface'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdateUserDTO } from './dto/update-user.dto'
import { MongoIdParams } from 'src/shared/dto/mongo-id-params.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return this.userService.createUser(createUserDTO)
  }

  @Get('external/:id')
  getUserByExternalId(@Param() { id }): Promise<User> {
    return this.userService.getUserByExternalId(id)
  }

  @Get(':id')
  getUser(@Param() { id }: MongoIdParams): Promise<User> {
    return this.userService.getUserById(id)
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

  @Post(':id/uploadPicture')
  @UseInterceptors(FileInterceptor('user_picture'))
  uploadUserPicture(
    @Param() { id }: MongoIdParams,
    @UploadedFile() file: Express.Multer.File
  ): Promise<string> {
    return this.userService.uploadUserPicture(id, file)
  }
}
