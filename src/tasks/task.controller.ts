import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskList } from './interfaces/task-list.interface'
import { MongoIdParams } from './dto/mongo-id-params.dto'
import { Task } from './interfaces/task.interface'
import { UserExternalId } from 'src/users/decorators/user-external-id.decorator'
import { UserIdByExternalIdPipe } from 'src/users/pipes/user-id-by-external-id.pipe'

@Controller('events/:eventId/task-lists')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getAllTaskLists(@Param() { eventId }: MongoIdParams): Promise<TaskList[]> {
    return this.taskService.getAllTaskLists(eventId)
  }

  @Post()
  createTaskList(
    @Param() { eventId }: MongoIdParams,
    @Body() body: { name: string }
  ): Promise<TaskList> {
    return this.taskService.createTaskList(body, eventId)
  }

  @Patch(':taskListId')
  updateTaskList(
    @Param() { taskListId }: MongoIdParams,
    @Body() body: { name: string }
  ): Promise<TaskList> {
    return this.taskService.updateTaskList(taskListId, body)
  }

  @Delete(':taskListId')
  deleteTaskList(@Param() { taskListId }: MongoIdParams): Promise<void> {
    return this.taskService.deleteTaskList(taskListId)
  }

  @Post(':taskListId')
  addTaskToList(
    @Param() { taskListId }: MongoIdParams,
    @Body() body: { name: string; description: string }
  ): Promise<Task[]> {
    return this.taskService.addTaskToList(taskListId, body)
  }

  @Patch(':taskListId/:taskId')
  updateTask(
    @Param() { taskListId, taskId }: MongoIdParams,
    @Body() body: { name: string; description: string }
  ): Promise<Task[]> {
    return this.taskService.updateTask(taskListId, taskId, body)
  }

  @Delete(':taskListId/:taskId')
  deleteTask(@Param() { taskListId, taskId }: MongoIdParams): Promise<Task[]> {
    return this.taskService.deleteTask(taskListId, taskId)
  }

  @Post(':taskListId/:taskId/assign')
  assignTask(
    @Param() { taskListId, taskId }: MongoIdParams,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<Task[]> {
    return this.taskService.assignTask(taskListId, taskId, userId)
  }

  @Delete(':taskListId/:taskId/assign')
  unassignTask(
    @Param() { taskListId, taskId }: MongoIdParams,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<Task[]> {
    return this.taskService.unassignTask(taskListId, taskId, userId)
  }
}
