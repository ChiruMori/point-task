import { prisma } from '../db'
import { Task, TaskStatus } from 'shared'

import logger from '../utils/logger'
import { ErrorWithStatus } from '../middleware/expHandler'

export const findTaskById = async (id: number) => {
  return prisma.task.findUnique({
    where: { id },
  })
}

export const listTasks = async (status?: TaskStatus) => {
  const where = status ? { status } : {}
  return prisma.task.findMany({
    where,
  })
}

export const createTask = async (task: Task, userId: number) => {
  return prisma.task.create({
    data: {
      ...task,
      creatorId: userId,
    },
  })
}

export const updateTask = async (id: number, task: Partial<Task>) => {
  const existing = await findTaskById(id)
  if (!existing) {
    throw new ErrorWithStatus(404, '任务不存在')
  }
  // 状态变更的合法性检查，仅允许从 editing -> active -> completed/expired
  const oldStatus = existing.status
  const newStatus = task.status || oldStatus
  if (oldStatus !== newStatus) {
    const validTransitions: Record<string, string[]> = {
      editing: ['active'],
      active: ['ended'],
      ended: [],
    }
    if (!validTransitions[oldStatus].includes(newStatus)) {
      logger.warn(`任务状态变更不合法: ${oldStatus} -> ${newStatus}`)
      throw new ErrorWithStatus(
        400,
        `任务状态不能从 ${oldStatus} 变更为 ${newStatus}`
      )
    }
  }

  return prisma.task.update({
    where: { id },
    data: {
      ...existing,
      ...task,
    },
  })
}

export const deleteTask = async (id: number) => {
  logger.info(`删除任务 ID: ${id}`)
  return prisma.task.delete({
    where: { id },
  })
}
