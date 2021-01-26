import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { GroupsController } from './groups.controller'
import { GroupSchema } from './groups.model'
import { GroupsService } from './groups.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema }])],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
