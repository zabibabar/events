import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { Group, Member } from './groups.model'

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get()
  async getGroups() {
    return await this.groupsService.getGroups()
  }

  @Post()
  async createGroup(@Body() body: Group) {
    const { name, description, members = [] } = body
    await this.groupsService.createGroup(name, description, members)

    return null
  }

  @Get(':id')
  async getGroup(@Param('id') id: string) {
    return await this.groupsService.getGroup(id)
  }

  @Patch(':id')
  async updateGroup(@Param('id') id: string, @Body() body: Partial<Group>) {
    await this.groupsService.updateGroup(id, body)
    return null
  }

  @Delete(':id')
  async deleteGroup(@Param('id') id: string) {
    await this.groupsService.deleteGroup(id)
    return null
  }

  @Post(':id/members')
  async addGroupMember(@Param('id') id: string, @Body() body: Member[]) {
    await this.groupsService.addGroupMembers(id, body)
    return null
  }

  @Delete(':id/members')
  async removeGroupMembers(@Param('id') id: string, @Body() body: string[]) {
    await this.groupsService.removeGroupMembers(id, body)
    return null
  }
}
