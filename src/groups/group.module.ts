import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { GroupController } from './group.controller'
import { GroupSchema, GROUP_COLLECTION_NAME } from './schemas/group.schema'
import { GroupService } from './group.service'
import { UserModule } from 'src/users/user.module'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GROUP_COLLECTION_NAME, schema: GroupSchema }]),
    UserModule,
    CloudinaryModule
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [MongooseModule, GroupService]
})
export class GroupModule {}
