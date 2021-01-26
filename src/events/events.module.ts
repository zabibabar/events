import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { EventController } from './events.controller'
import { EventSchema } from './events.model'
import { EventService } from './events.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }])],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
