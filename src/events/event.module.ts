import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { EventsController } from './event.controller'
import { EventSchema, EVENT_COLLECTION_NAME } from './schemas/event.schema'
import { EventsService } from './event.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: EVENT_COLLECTION_NAME, schema: EventSchema }])],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
