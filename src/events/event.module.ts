import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { EventsController } from './event.controller'
import { EventSchema } from './schemas/event.schema'
import { EventsService } from './event.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }])],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
