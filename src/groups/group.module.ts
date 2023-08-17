import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { GroupController } from './group.controller'
import { GroupSchema, GROUP_COLLECTION_NAME } from './schemas/group.schema'
import { GroupService } from './group.service'
import { UsersModule } from 'src/users/user.module'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
import { EventsModule } from 'src/events/event.module'
import { GroupMemberService } from './group-member.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GROUP_COLLECTION_NAME, schema: GroupSchema }]),
    UsersModule,
    CloudinaryModule,
    forwardRef(() => EventsModule)
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupMemberService],
  exports: [MongooseModule, GroupService, GroupMemberService]
})
export class GroupsModule {}
