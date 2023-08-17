import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { EventsController } from './event.controller'
import { EventSchema, EVENT_COLLECTION_NAME } from './schemas/event.schema'
import { EventService } from './event.service'
import { UsersModule } from 'src/users/user.module'
import { GroupsModule } from 'src/groups/group.module'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EVENT_COLLECTION_NAME, schema: EventSchema }]),
    UsersModule,
    forwardRef(() => GroupsModule),
    CloudinaryModule
  ],
  controllers: [EventsController],
  providers: [EventService],
  exports: [MongooseModule, EventService]
})
export class EventsModule {}
