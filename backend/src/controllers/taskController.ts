import { Request, Response } from 'express'
import * as taskService from '../services/taskService'
import { Task, User } from 'shared'
import { ErrorWithStatus } from '../middleware/expHandler'

export const getTaskById = async (req: Request, res: Response) => {
  const tid = parseInt(req.query.tid as string, 10)
  if (isNaN(tid)) {
    throw new ErrorWithStatus(400, '非法任务ID')
  }
  const task = await taskService.findTaskById(tid)
  if (!task) {
    throw new ErrorWithStatus(404, '任务未找到')
  }
  return res.status(200).json({ task })
}

export const listTasks = async (_: Request, res: Response) => {
  const tasks = await taskService.listTasks()
  return res.status(200).json({ tasks })
}

export const createTask = async (req: Request, res: Response) => {
  const taskData = req.body as Task
  if (!taskData.title || !taskData.desc) {
    throw new ErrorWithStatus(400, '任务字段不完整')
  }
  const user = (req as any).user as User
  const task = await taskService.createTask(taskData, user.id)
  return res.status(201).json({ task })
}

export const updateTask = async (req: Request, res: Response) => {
  const taskData = req.body as Partial<Task>
  const tid = taskData.id || NaN
  if (isNaN(tid)) {
    throw new ErrorWithStatus(400, '非法任务ID')
  }
  const updatedTask = await taskService.updateTask(tid, taskData)
  return res.status(200).json({ task: updatedTask })
}

export const deleteTask = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string, 10)
  if (isNaN(id)) {
    throw new ErrorWithStatus(400, '非法任务ID')
  }
  await taskService.deleteTask(id)
  return res.status(200).json({ res: '任务删除成功' })
}
