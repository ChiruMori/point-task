import { prisma } from '../db'
import { TaskRecord, TaskStatus } from 'shared'
import * as taskService from './taskService'

export const findRecordById = async (id: number) => {
  return prisma.taskRecord.findUnique({
    where: { id },
  })
}

export const recordPage = async (
  uid: number,
  status: TaskStatus = 'active',
  page: number = 0,
  pageSize: number = 20
) => {
  const allTasks = await taskService.listTasks(
    status === 'active' ? status : undefined
  )
  // active 状态时，记录列表为空，其余状态分页查询后返回
  if (status === 'active') {
    return {
      tasks: allTasks,
      records: [],
    }
  }
  const taskIds = allTasks.map((t) => t.id)
  // 按 ID 降序排序，分页查询
  const where = {
    userId: uid,
    taskId: {
      in: taskIds,
    },
  }
  const records = await prisma.taskRecord.findMany({
    where,
    orderBy: {
      id: 'desc',
    },
    skip: page * pageSize,
    take: pageSize,
  })
  const cnt = await prisma.taskRecord.count({ where })
  return {
    tasks: allTasks,
    records,
    cnt,
  }
}

export const createRecord = async (
  record: Omit<TaskRecord, 'id' | 'createTime' | 'updateTime'>
) => {
  return prisma.taskRecord.create({
    data: record,
  })
}

export const deleteById = async (id: number) => {
  return prisma.taskRecord.delete({
    where: { id },
  })
}
