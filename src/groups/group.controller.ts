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
import { UserExternalId } from 'src/users/decorators/user-external-id.decorator'
import { UserIdByExternalIdPipe } from 'src/users/pipes/user-id-by-external-id.pipe'
import { CreateGroupDTO } from './dto/create-group.dto'
import { UpdateGroupDTO } from './dto/update-group.dto'

import { GroupService } from './group.service'
import { Group } from './interfaces/group.interface'
import { Member } from './interfaces/member.interface'

@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  getGroups(@UserExternalId(UserIdByExternalIdPipe) userId: string): Promise<Group[]> {
    return this.groupService.getGroups(userId)
  }

  @Post()
  async createGroup(
    @Body() body: CreateGroupDTO,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<Group> {
    return this.groupService.createGroup(body, userId)
  }

  @Get(':id')
  async getGroup(@Param() { id }: MongoIdParams): Promise<Group> {
    return await this.groupService.getGroup(id)
  }

  @Patch(':id')
  updateGroup(@Param() { id }: MongoIdParams, @Body() body: UpdateGroupDTO): Promise<Group> {
    return this.groupService.updateGroup(id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteGroup(@Param() { id }: MongoIdParams): Promise<void> {
    return this.groupService.deleteGroup(id)
  }

  @Get(':id/members')
  getGroupMembers(@Param() { id }: MongoIdParams): Promise<Member[]> {
    return this.groupService.getGroupMembers(id)
  }

  @Post(':id/members')
  addGroupMembers(@Param() { id }: MongoIdParams, @Body() body: string[]): Promise<Member[]> {
    return this.groupService.addGroupMembers(id, body)
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeGroupMember(
    @Param() { id, memberId }: MongoIdParams & { memberId: string }
  ): Promise<void> {
    return this.groupService.removeGroupMember(id, memberId)
  }
}
