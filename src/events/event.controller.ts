import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { MongoIdParams } from 'src/shared/dto/mongo-id-params.dto'
import { AttendeeDTO, CreateEventDTO } from './dto/create-event.dto'
import { UpdateEventDTO } from './dto/update-event.dto'

import { EventService } from './event.service'
import { Attendee } from './interfaces/attendee.interface'
import { Event } from './interfaces/event.interface'

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get()
  getEvents(): Promise<Event[]> {
    return this.eventService.getEvents()
  }

  @Post()
  createEvent(@Body() body: CreateEventDTO): Promise<Event> {
    return this.eventService.createEvent(body)
  }

  @Get(':id')
  getEvent(@Param() { id }: MongoIdParams): Promise<Event> {
    return this.eventService.getEvent(id)
  }

  @Patch(':id')
  updateEvent(@Param() { id }: MongoIdParams, @Body() body: UpdateEventDTO): Promise<Event> {
    return this.eventService.updateEvent(id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEvent(@Param() { id }: MongoIdParams): Promise<void> {
    return this.eventService.deleteEvent(id)
  }

  @Get(':id/attendees')
  getEventAttendees(@Param() { id }: MongoIdParams): Promise<Attendee[]> {
    return this.eventService.getEventAttendees(id)
  }

  @Post(':id/attendees')
  addEventAttendees(
    @Param() { id }: MongoIdParams,
    @Body() body: AttendeeDTO[]
  ): Promise<Attendee[]> {
    return this.eventService.addEventAttendees(id, body)
  }

  @Delete(':id/attendees')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeEventAttendees(@Param() { id }: MongoIdParams, @Body() body: string[]): Promise<void> {
    return this.eventService.removeEventAttendees(id, body)
  }
}
