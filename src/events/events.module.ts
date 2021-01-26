import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { EventsController } from './events.controller'
import { EventSchema } from './events.model'
import { EventsService } from './events.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }])],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
