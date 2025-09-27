import { TaskRecord, TaskStatus, User } from 'shared'
import { ErrorWithStatus } from '../middleware/expHandler'
import { Request, Response } from 'express'
import { prisma } from '../db'
import * as recordService from '../services/recordService'
import * as userService from '../services/userService'
import logger from '../utils/logger'

export const getRecordById = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string, 10)
  if (isNaN(id)) {
    throw new ErrorWithStatus(400, '非法记录ID')
  }
  const record = await recordService.findRecordById(id)
  if (!record) {
    throw new ErrorWithStatus(404, '记录未找到')
  }
  return res.status(200).json(record)
}

export const pageRecords = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 0
  const pageSize = parseInt(req.query.pageSize as string, 10) || 20
  const status = (req.query.status || 'active') as TaskStatus
  const user = (req as any).user as User
  const result = await recordService.recordPage(user.id, status, page, pageSize)
  return res.status(200).json(result)
}

export const createRecord = async (req: Request, res: Response) => {
  const recordData = req.body as Omit<
    TaskRecord,
    'id' | 'createTime' | 'updateTime'
  >
  if (!recordData.taskId || !recordData.status) {
    throw new ErrorWithStatus(400, '记录字段不完整')
  }
  // 事务内执行
  await prisma
    .$transaction(async (_tx) => {
      const record = await recordService.createRecord(recordData)
      // 加积分
      await userService.addPoints(recordData.userId, recordData.pointsAwarded)
      return res.status(201).json(record)
    })
    .catch((err) => {
      logger.error('任务完成失败', err)
      throw err
    })
}

export const deleteRecord = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string, 10)
  if (isNaN(id)) {
    throw new ErrorWithStatus(400, '非法记录ID')
  }
  await recordService.deleteById(id)
  return res.status(204).send()
}
