import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import { MongoIdParams } from 'src/shared/dto/mongo-id-params.dto'
import { UserExternalId } from 'src/users/decorators/user-external-id.decorator'
import { UserIdByExternalIdPipe } from 'src/users/pipes/user-id-by-external-id.pipe'
import { AttendeeDTO, CreateEventDTO } from './dto/create-event.dto'
import { UpdateEventDTO } from './dto/update-event.dto'

import { EventService } from './event.service'
import { Attendee } from './interfaces/attendee.interface'
import { Event } from './interfaces/event.interface'

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get()
  getEvents(@UserExternalId(UserIdByExternalIdPipe) userId: string): Promise<Event[]> {
    return this.eventService.getEvents(userId)
  }

  @Get()
  getEventsByGroupId(@Query('groupId') groupId: string): Promise<Event[]> {
    return this.eventService.getEventsByGroupId(groupId)
  }

  @Get(':id')
  getEvent(@Param() { id }: MongoIdParams): Promise<Event> {
    return this.eventService.getEvent(id)
  }

  @Post()
  createEvent(
    @Body() body: CreateEventDTO,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<Event> {
    return this.eventService.createEvent(body, userId)
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
  addEventAttendee(@Param() { id }: MongoIdParams, @Body() body: AttendeeDTO): Promise<Attendee[]> {
    return this.eventService.addEventAttendee(id, body)
  }

  @Delete(':id/attendees')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeEventAttendees(@Param() { id }: MongoIdParams, @Body() body: string[]): Promise<void> {
    return this.eventService.removeEventAttendees(id, body)
  }
}
