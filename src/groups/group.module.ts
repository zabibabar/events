import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { GroupController } from './group.controller'
import { GroupSchema } from './schemas/group.schema'
import { GroupService } from './group.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema }])],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule {}
