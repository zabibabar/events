import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { GroupService } from './group.service'
import { Group } from './interfaces/group.interface'
import { Member } from './interfaces/member.interface'

@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  async getGroups() {
    return await this.groupService.getGroups()
  }

  @Post()
  async createGroup(@Body() body: Group) {
    const { name, description, members = [] } = body
    await this.groupService.createGroup(name, description, members)

    return null
  }

  @Get(':id')
  async getGroup(@Param('id') id: string) {
    return await this.groupService.getGroup(id)
  }

  @Patch(':id')
  async updateGroup(@Param('id') id: string, @Body() body: Partial<Group>) {
    await this.groupService.updateGroup(id, body)
    return null
  }

  @Delete(':id')
  async deleteGroup(@Param('id') id: string) {
    await this.groupService.deleteGroup(id)
    return null
  }

  @Post(':id/members')
  async addGroupMember(@Param('id') id: string, @Body() body: Member[]) {
    await this.groupService.addGroupMembers(id, body)
    return null
  }

  @Delete(':id/members')
  async removeGroupMembers(@Param('id') id: string, @Body() body: string[]) {
    await this.groupService.removeGroupMembers(id, body)
    return null
  }
}
