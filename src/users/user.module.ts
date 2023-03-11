import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema, USER_COLLECTION_NAME } from './schemas/user.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_COLLECTION_NAME, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
