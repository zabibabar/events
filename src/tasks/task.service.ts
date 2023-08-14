import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TASK_LIST_COLLECTION_NAME, TaskListDocument } from './schemas/task-list.schema'
import { TaskList } from './interfaces/task-list.interface'
import { Task } from './interfaces/task.interface'
import { TaskUpdateDTO } from './dto/task-update.dto'
import { TaskCreateDTO } from './dto/task-create.dto'
import { TaskListUpdateDTO } from './dto/task-list-update.dto'

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(TASK_LIST_COLLECTION_NAME) private TaskListModel: Model<TaskListDocument>
  ) {}

  async getAllTaskLists(eventId: string): Promise<TaskList[]> {
    const taskLists = await this.TaskListModel.find({ eventId })
      .populate({
        path: 'tasks.assignedTo.user',
        select: 'name picture'
      })
      .exec()
    return taskLists.map((taskListDoc) => this.convertTaskListDocumentToTaskList(taskListDoc))
  }

  private async getTaskList(id: string): Promise<TaskList> {
    const taskListDoc = await this.TaskListModel.findById(id)
      .populate({
        path: 'tasks.assignedTo.user',
        select: 'name picture'
      })
      .exec()
    return this.convertTaskListDocumentToTaskList(taskListDoc)
  }

  async createTaskList(body: TaskCreateDTO, eventId: string): Promise<TaskList> {
    const newTaskList = new this.TaskListModel({
      ...body,
      tasks: [],
      eventId: eventId
    })

    return this.convertTaskListDocumentToTaskList(await newTaskList.save())
  }

  async updateTaskList(taskListId: string, taskListFields: TaskListUpdateDTO): Promise<TaskList> {
    const taskListDoc = await this.TaskListModel.findByIdAndUpdate(
      taskListId,
      { $set: taskListFields },
      { new: true }
    )
      .populate({
        path: 'tasks.assignedTo.user',
        select: 'name picture'
      })
      .exec()

    return this.convertTaskListDocumentToTaskList(taskListDoc)
  }

  async deleteTaskList(taskListId: string): Promise<void> {
    const result = await this.TaskListModel.deleteOne({ _id: taskListId })
      .populate({
        path: 'tasks.assignedTo.user',
        select: 'name picture'
      })
      .exec()
    if (result.deletedCount === 0) throw new NotFoundException('Task List not found')
  }

  async addTaskToList(taskListId: string, task: TaskCreateDTO): Promise<Task[]> {
    const taskListDoc = await this.TaskListModel.findByIdAndUpdate(
      taskListId,
      { $push: { tasks: { ...task, assignedTo: [] } } },
      { new: true }
    )
      .populate({
        path: 'tasks.assignedTo.user',
        select: 'name picture'
      })
      .exec()

    return this.convertTaskListDocumentToTaskList(taskListDoc).tasks
  }

  async updateTask(taskListId: string, taskId: string, task: TaskUpdateDTO): Promise<Task[]> {
    const taskListDoc = await this.TaskListModel.findOneAndUpdate(
      { _id: taskListId, 'tasks._id': taskId },
      { $set: { 'tasks.$.name': task.name, 'tasks.$.description': task.description } },
      { new: true }
    )
      .populate({
        path: 'tasks.assignedTo.user',
        select: 'name picture'
      })
      .exec()
    console.log(taskListDoc)
    return this.convertTaskListDocumentToTaskList(taskListDoc).tasks
  }

  async deleteTask(taskListId: string, taskId: string): Promise<Task[]> {
    const taskListDoc = await this.TaskListModel.findOneAndUpdate(
      { _id: taskListId },
      { $pull: { tasks: { id: taskId } } },
      { new: true }
    )
      .populate({
        path: 'tasks.assignedTo.user',
        select: 'name picture'
      })
      .exec()

    return this.convertTaskListDocumentToTaskList(taskListDoc).tasks
  }

  async assignTask(taskListId: string, taskId: string, userId: string): Promise<Task[]> {
    const taskListDoc = await this.TaskListModel.findOneAndUpdate(
      { _id: taskListId, 'tasks._id': taskId },
      { $push: { 'tasks.$.assignedTo': { userId } } },
      { new: true }
    )
      .populate({
        path: 'tasks.assignedTo.user',
        select: 'name picture'
      })
      .exec()

    return this.convertTaskListDocumentToTaskList(taskListDoc).tasks
  }

  async unassignTask(taskListId: string, taskId: string, userId: string): Promise<Task[]> {
    const taskListDoc = await this.TaskListModel.findOneAndUpdate(
      { _id: taskListId, 'tasks._id': taskId },
      { $pull: { 'tasks.$.assignedTo': { userId } } },
      { new: true }
    )
      .populate({
        path: 'tasks.assignedTo.user',
        select: 'name picture'
      })
      .exec()

    return this.convertTaskListDocumentToTaskList(taskListDoc).tasks
  }

  private convertTaskListDocumentToTaskList(taskListDoc: TaskListDocument | null): TaskList {
    if (!taskListDoc) throw new NotFoundException('Task List not found')
    return taskListDoc.toJSON()
  }
}
