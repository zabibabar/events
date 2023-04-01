import { PipeTransform, Injectable } from '@nestjs/common'
import { UserService } from '../user.service'

@Injectable()
export class UserIdByExternalIdPipe implements PipeTransform<string, Promise<string>> {
  constructor(private readonly userService: UserService) {}

  async transform(externalId: string): Promise<string> {
    const user = await this.userService.getUserByExternalId(externalId)
    return user.id.toString()
  }
}
