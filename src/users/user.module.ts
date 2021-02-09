import { Module } from '@nestjs/common'
import { UsersService } from './user.service'
import { UsersController } from './user.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersSchema, USER_COLLECTION_NAME } from './schemas/user.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_COLLECTION_NAME, schema: UsersSchema }])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
