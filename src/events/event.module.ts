import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { EventsController } from './event.controller'
import { EventSchema, EVENT_COLLECTION_NAME } from './schemas/event.schema'
import { EventService } from './event.service'
import { UserModule } from 'src/users/user.module'
import { GroupModule } from 'src/groups/group.module'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EVENT_COLLECTION_NAME, schema: EventSchema }]),
    UserModule,
    GroupModule,
    CloudinaryModule
  ],
  controllers: [EventsController],
  providers: [EventService],
  exports: [MongooseModule]
})
export class EventsModule {}
