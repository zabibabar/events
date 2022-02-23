import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put
} from '@nestjs/common'
import { MongoIdParams } from 'src/shared/dto/mongo-id-params.dto'
import { CreateGroupDTO } from './dto/create-group.dto'
import { UpdateGroupDTO } from './dto/update-group.dto'

import { GroupService } from './group.service'
import { Group } from './interfaces/group.interface'
import { Member } from './interfaces/member.interface'

@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  getGroups(): Promise<Group[]> {
    return this.groupService.getGroups()
  }

  @Post()
  async createGroup(@Body() body: CreateGroupDTO): Promise<Group> {
    return this.groupService.createGroup(body)
  }

  @Get(':id')
  async getGroup(@Param() { id }: MongoIdParams): Promise<Group> {
    return await this.groupService.getGroup(id)
  }

  @Put(':id')
  updateGroup(@Param() { id }: MongoIdParams, @Body() body: UpdateGroupDTO): Promise<Group> {
    return this.groupService.updateGroup(id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteGroup(@Param() { id }: MongoIdParams): Promise<void> {
    return this.groupService.deleteGroup(id)
  }

  @Post(':id/members')
  addGroupMembers(@Param() { id }: MongoIdParams, @Body() body: string[]): Promise<Member[]> {
    return this.groupService.addGroupMembers(id, body)
  }

  @Delete(':id/members')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeGroupMembers(@Param() { id }: MongoIdParams, @Body() body: string[]): Promise<void> {
    return this.groupService.removeGroupMembers(id, body)
  }
}
