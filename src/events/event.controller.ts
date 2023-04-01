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
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MongoIdParams } from 'src/shared/dto/mongo-id-params.dto'
import { UserExternalId } from 'src/users/decorators/user-external-id.decorator'
import { UserIdByExternalIdPipe } from 'src/users/pipes/user-id-by-external-id.pipe'
import { CreateEventDTO } from './dto/create-event.dto'
import { EventQueryParamDTO } from './dto/event-query-param.dto'
import { UpdateAttendeeDTO } from './dto/update-attendee-dto'
import { UpdateEventDTO } from './dto/update-event.dto'

import { EventService } from './event.service'
import { Attendee } from './interfaces/attendee.interface'
import { Event } from './interfaces/event.interface'

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  // @Get()
  // getEventsByUserId(@UserExternalId(UserIdByExternalIdPipe) userId: string): Promise<Event[]> {
  //   return this.eventService.getEventsByUserId(userId)
  // }

  @Get()
  getEventsByGroupId(@Query() query: EventQueryParamDTO): Promise<Event[]> {
    return this.eventService.getEventsByGroupId(query.groupId, query)
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

  @Post(':id/uploadPicture')
  @UseInterceptors(FileInterceptor('event_picture'))
  uploadGroupPicture(
    @Param() { id }: MongoIdParams,
    @UploadedFile() file: Express.Multer.File
  ): Promise<string> {
    return this.eventService.uploadEventPicture(id, file)
  }

  @Get(':id/attendees')
  getEventAttendees(@Param() { id }: MongoIdParams): Promise<Attendee[]> {
    return this.eventService.getEventAttendees(id)
  }

  @Put(':id/attendees')
  updateEventAttendee(
    @Param() { id }: MongoIdParams,
    @UserExternalId(UserIdByExternalIdPipe) userId: string,
    @Body() body: UpdateAttendeeDTO
  ): Promise<Attendee[]> {
    return this.eventService.updateEventAttendee(id, userId, body)
  }
}
