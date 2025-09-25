import { Request, Response } from 'express'
import * as taskService from '../services/taskService'
import { Task, User } from 'shared'

export const getTaskById = async (req: Request, res: Response) => {
  const tid = parseInt(req.params.tid, 10)
  if (isNaN(tid)) {
    return res.status(400).json({ message: '非法任务ID' })
  }
  const task = await taskService.findTaskById(tid)
  if (!task) {
    return res.status(404).json({ message: '任务未找到' })
  }
  return res.status(200).json(task)
}

export const listTasks = async (_: Request, res: Response) => {
  const tasks = await taskService.listTasks()
  return res.status(200).json(tasks)
}

export const createTask = async (req: Request, res: Response) => {
  const taskData = req.body as Task
  if (!taskData.title || !taskData.desc) {
    return res.status(400).json({ message: '任务字段不完整' })
  }
  const user = (req as any).user as User
  const task = await taskService.createTask(taskData, user.id)
  return res.status(201).json(task)
}

export const updateTask = async (req: Request, res: Response) => {
  const tid = parseInt(req.params.tid, 10)
  if (isNaN(tid)) {
    return res.status(400).json({ message: '非法任务ID' })
  }
  const taskData = req.body as Partial<Task>
  const updatedTask = await taskService.updateTask(tid, taskData)
  return res.status(200).json(updatedTask)
}

export const deleteTask = async (req: Request, res: Response) => {
  const tid = parseInt(req.params.tid, 10)
  if (isNaN(tid)) {
    return res.status(400).json({ message: '非法任务ID' })
  }
  await taskService.deleteTask(tid)
  return res.status(204).send()
}
