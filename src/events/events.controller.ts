import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { EventService } from './events.service'
import { Event } from './events.model'

@Controller('Events')
export class EventController {
  constructor(private EventsService: EventService) {}

  @Get()
  async getEvents() {
    return await this.EventsService.getEvents()
  }

  @Post()
  async createEvent(@Body() body: Event) {
    return await this.EventsService.createEvent(body)
  }

  @Get(':id')
  async getEvent(@Param() id: string) {
    return await this.EventsService.getEvent(id)
  }

  @Patch(':id')
  async updateEvent(@Param() id: string, @Body() body: Event) {
    return await this.EventsService.updateEvent(id, body)
  }

  @Delete(':id')
  async deleteEvent(@Param() id: string) {
    return await this.EventsService.deleteEvent(id)
  }
}
