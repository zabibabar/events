import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { EventsService } from './event.service'
import { Event } from './interfaces/event.interface'

@Controller('Events')
export class EventsController {
  constructor(private EventsService: EventsService) {}

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
