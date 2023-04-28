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
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MongoIdParams } from 'src/shared/dto/mongo-id-params.dto'
import { UserExternalId } from 'src/users/decorators/user-external-id.decorator'
import { UserIdByExternalIdPipe } from 'src/users/pipes/user-id-by-external-id.pipe'
import { CreateEventDTO } from './dto/create-event.dto'
import { EventQueryParamDTO } from './dto/event-query-param.dto'
import { UpdateAttendeeDTO } from './dto/update-attendee.dto'
import { UpdateEventDTO } from './dto/update-event.dto'

import { EventService } from './event.service'
import { Attendee } from './interfaces/attendee.interface'
import { Event } from './interfaces/event.interface'
import { EventFutureGuard } from './guards/event-future.guard'
import { AddAttendeeDTO } from './dto/add-attendee.dto'
import { EventCountQueryParamDTO } from './dto/event-count-query-param.dto'
import { EventCountResponseDTO } from './dto/event-count-response.dto'
import { EventGroupMemberGuard } from './guards/event-group-member.guard'
import { GroupMemberGuard } from 'src/groups/guards/group-member.guard'

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get('user')
  getEventsFromAllJoinedGroups(
    @UserExternalId(UserIdByExternalIdPipe) userId: string,
    @Query() query: EventQueryParamDTO
  ): Promise<Event[]> {
    return this.eventService.getEventsFromAllJoinedGroups(userId, query)
  }

  @Get('group/:id')
  @UseGuards(GroupMemberGuard)
  getEventsByGroupId(
    @Param() { id: groupId }: MongoIdParams,
    @Query() query: EventQueryParamDTO
  ): Promise<Event[]> {
    return this.eventService.getEventsByGroupId(groupId, query)
  }

  @Get('group/:id/count')
  @UseGuards(GroupMemberGuard)
  getEventCount(
    @Param() { id: groupId }: MongoIdParams,
    @Query() query: EventCountQueryParamDTO
  ): Promise<EventCountResponseDTO> {
    return this.eventService.getEventCountByGroupId(groupId, query.currentDate)
  }

  @Get(':id')
  @UseGuards(EventGroupMemberGuard)
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
  @UseGuards(EventGroupMemberGuard)
  updateEvent(@Param() { id }: MongoIdParams, @Body() body: UpdateEventDTO): Promise<Event> {
    return this.eventService.updateEvent(id, body)
  }

  @Delete(':id')
  @UseGuards(EventGroupMemberGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEvent(@Param() { id }: MongoIdParams): Promise<void> {
    return this.eventService.deleteEvent(id)
  }

  @Post(':id/uploadPicture')
  @UseGuards(EventGroupMemberGuard)
  @UseInterceptors(FileInterceptor('event_picture'))
  uploadGroupPicture(
    @Param() { id }: MongoIdParams,
    @UploadedFile() file: Express.Multer.File
  ): Promise<string> {
    return this.eventService.uploadEventPicture(id, file)
  }

  @Get(':id/attendees')
  @UseGuards(EventGroupMemberGuard)
  getEventAttendees(@Param() { id }: MongoIdParams): Promise<Attendee[]> {
    return this.eventService.getEventAttendees(id)
  }

  @Post(':id/attendees')
  @UseGuards(EventGroupMemberGuard, EventFutureGuard)
  addEventAttendee(
    @Param() { id }: MongoIdParams,
    @Body() { userId }: AddAttendeeDTO
  ): Promise<Attendee[]> {
    return this.eventService.addEventAttendee(id, userId)
  }

  @Patch(':id/attendees/:attendeeId')
  @UseGuards(EventGroupMemberGuard, EventFutureGuard)
  updateEventAttendee(
    @Param() { id, attendeeId }: MongoIdParams & { attendeeId: string },
    @Body() body: UpdateAttendeeDTO
  ): Promise<Attendee[]> {
    return this.eventService.updateEventAttendee(id, attendeeId, body)
  }
}
