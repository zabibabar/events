import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { TASK_LIST_COLLECTION_NAME, TaskListSchema } from './schemas/task-list.schema'
import { TaskController } from './task.controller'
import { TaskService } from './task.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TASK_LIST_COLLECTION_NAME, schema: TaskListSchema }])
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [MongooseModule, TaskService]
})
export class EventsModule {}
