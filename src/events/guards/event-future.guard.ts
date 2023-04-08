import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { EventService } from '../event.service'

@Injectable()
export class EventFutureGuard implements CanActivate {
  constructor(private eventService: EventService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const eventId = request.params.id
    const currentDate = new Date(request.body.currentDate)

    return this.eventService.isEventUpcoming(eventId, currentDate)
  }
}
