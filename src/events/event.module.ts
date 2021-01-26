import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { EventController } from './Event.controller'
import { EventSchema } from './Event.model'
import { EventService } from './Event.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }])],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
