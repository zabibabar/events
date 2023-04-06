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
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MongoIdParams } from 'src/shared/dto/mongo-id-params.dto'
import { UserExternalId } from 'src/users/decorators/user-external-id.decorator'
import { UserIdByExternalIdPipe } from 'src/users/pipes/user-id-by-external-id.pipe'
import { CreateGroupDTO } from './dto/create-group.dto'
import { UpdateGroupDTO } from './dto/update-group.dto'

import { GroupService } from './group.service'
import { Group } from './interfaces/group.interface'
import { Member } from './interfaces/member.interface'
import { GroupMemberService } from './group-member.service'
import { GroupQueryParamDTO } from './dto/group-query-param.dto'
import { GroupDeleteDTO } from './dto/group-delete.dto'

@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService, private groupMemberService: GroupMemberService) {}

  @Get()
  getGroups(
    @UserExternalId(UserIdByExternalIdPipe) userId: string,
    @Query() query: GroupQueryParamDTO
  ): Promise<Group[]> {
    return this.groupService.getGroups(userId, query)
  }

  @Post()
  createGroup(
    @Body() body: CreateGroupDTO,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<Group> {
    return this.groupService.createGroup(body, userId)
  }

  @Get(':id')
  getGroup(@Param() { id }: MongoIdParams): Promise<Group> {
    return this.groupService.getGroup(id)
  }

  @Patch(':id')
  updateGroup(@Param() { id }: MongoIdParams, @Body() body: UpdateGroupDTO): Promise<Group> {
    return this.groupService.updateGroup(id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteGroup(@Param() { id }: MongoIdParams, @Body() body: GroupDeleteDTO): Promise<void> {
    return this.groupService.deleteGroup(id, body.currentDate)
  }

  @Post(':id/uploadPicture')
  @UseInterceptors(FileInterceptor('group_picture'))
  uploadGroupPicture(
    @Param() { id }: MongoIdParams,
    @UploadedFile() file: Express.Multer.File
  ): Promise<string> {
    return this.groupService.uploadGroupPicture(id, file)
  }

  @Post('/join')
  addToGroupViaInviteCode(
    @Query('inviteCode') inviteCode: string,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<Group> {
    return this.groupService.addToGroupViaInviteCode(inviteCode, userId)
  }

  @Get(':id/members')
  getGroupMembers(@Param() { id }: MongoIdParams): Promise<Member[]> {
    return this.groupMemberService.getGroupMembers(id)
  }

  @Post(':id/members')
  addGroupMember(
    @Param() { id }: MongoIdParams,
    @Body() body: { userId: string }
  ): Promise<Member[]> {
    return this.groupMemberService.addGroupMember(id, body.userId)
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeGroupMember(
    @Param() { id, memberId }: MongoIdParams & { memberId: string },
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<void> {
    return this.groupMemberService.removeGroupMember(id, memberId, userId)
  }
}
