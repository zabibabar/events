import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskList } from './interfaces/task-list.interface'
import { MongoIdParams } from './dto/mongo-id-params.dto'
import { Task } from './interfaces/task.interface'
import { UserExternalId } from 'src/users/decorators/user-external-id.decorator'
import { UserIdByExternalIdPipe } from 'src/users/pipes/user-id-by-external-id.pipe'
import { TaskUpdateDTO } from './dto/task-update.dto'
import { TaskCreateDTO } from './dto/task-create.dto'
import { TaskListUpdateDTO } from './dto/task-list-update.dto'
import { TaskListCreateDTO } from './dto/task-list-create.dto'

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
    @Body() body: TaskListCreateDTO
  ): Promise<TaskList> {
    return this.taskService.createTaskList(body, eventId)
  }

  @Patch(':taskListId')
  updateTaskList(
    @Param() { taskListId }: MongoIdParams,
    @Body() body: TaskListUpdateDTO
  ): Promise<TaskList> {
    return this.taskService.updateTaskList(taskListId, body)
  }

  @Delete(':taskListId')
  deleteTaskList(@Param() { taskListId }: MongoIdParams): Promise<void> {
    return this.taskService.deleteTaskList(taskListId)
  }

  @Post(':taskListId/tasks')
  addTaskToList(
    @Param() { taskListId }: MongoIdParams,
    @Body() body: TaskCreateDTO
  ): Promise<Task[]> {
    return this.taskService.addTaskToList(taskListId, body)
  }

  @Patch(':taskListId/tasks/:taskId')
  updateTask(
    @Param() { taskListId, taskId }: MongoIdParams,
    @Body() body: TaskUpdateDTO
  ): Promise<Task[]> {
    return this.taskService.updateTask(taskListId, taskId, body)
  }

  @Delete(':taskListId/tasks/:taskId')
  deleteTask(@Param() { taskListId, taskId }: MongoIdParams): Promise<Task[]> {
    return this.taskService.deleteTask(taskListId, taskId)
  }

  @Post(':taskListId/tasks/:taskId/assign')
  assignTask(
    @Param() { taskListId, taskId }: MongoIdParams,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<Task[]> {
    return this.taskService.assignTask(taskListId, taskId, userId)
  }

  @Delete(':taskListId/tasks/:taskId/assign')
  unassignTask(
    @Param() { taskListId, taskId }: MongoIdParams,
    @UserExternalId(UserIdByExternalIdPipe) userId: string
  ): Promise<Task[]> {
    return this.taskService.unassignTask(taskListId, taskId, userId)
  }
}
