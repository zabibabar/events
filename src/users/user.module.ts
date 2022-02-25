import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UsersController } from './user.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema, USER_COLLECTION_NAME } from './schemas/user.schema'
import { GroupModule } from 'src/groups/group.module'
import { EventsModule } from 'src/events/event.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER_COLLECTION_NAME, schema: UserSchema }]),
    GroupModule,
    EventsModule
  ],
  controllers: [UsersController],
  providers: [UserService]
})
export class UsersModule {}
