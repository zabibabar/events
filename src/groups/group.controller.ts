import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CreateGroupDTO } from './dto/create-group.dto'
import { UpdateGroupDTO } from './dto/update-group.dto'

import { GroupService } from './group.service'
import { Group } from './interfaces/group.interface'
import { Member } from './interfaces/member.interface'

@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  async getGroups(): Promise<Group[]> {
    return await this.groupService.getGroups()
  }

  @Post()
  async createGroup(@Body() body: CreateGroupDTO): Promise<Group> {
    await this.groupService.createGroup(body)

    return null
  }

  @Get(':id')
  async getGroup(@Param('id') id: string): Promise<Group> {
    return await this.groupService.getGroup(id)
  }

  @Patch(':id')
  async updateGroup(@Param('id') id: string, @Body() body: UpdateGroupDTO): Promise<void> {
    await this.groupService.updateGroup(id, body)
    return null
  }

  @Delete(':id')
  async deleteGroup(@Param('id') id: string): Promise<void> {
    await this.groupService.deleteGroup(id)
    return null
  }

  @Post(':id/members')
  async addGroupMember(@Param('id') id: string, @Body() body: Member[]): Promise<void> {
    await this.groupService.addGroupMembers(id, body)
    return null
  }

  @Delete(':id/members')
  async removeGroupMembers(@Param('id') id: string, @Body() body: string[]): Promise<void> {
    await this.groupService.removeGroupMembers(id, body)
    return null
  }
}
