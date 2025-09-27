import { Request, Response } from 'express'
import * as rewardService from '../services/rewardService'
import { Reward } from 'shared'
import { ErrorWithStatus } from '../middleware/expHandler'

export const getRewardById = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string, 10)
  if (isNaN(id)) {
    throw new ErrorWithStatus(400, '非法奖励ID')
  }
  const reward = await rewardService.findRewardById(id)
  if (!reward) {
    throw new ErrorWithStatus(404, '奖励未找到')
  }
  return res.status(200).json({ reward })
}

export const createReward = async (req: Request, res: Response) => {
  const rewardData = req.body as Reward
  if (!rewardData.fx) {
    throw new ErrorWithStatus(400, '奖励字段不完整')
  }
  const reward = await rewardService.createReward(rewardData)
  return res.status(201).json({ reward })
}

export const deleteReward = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string, 10)
  if (isNaN(id)) {
    throw new ErrorWithStatus(400, '非法奖励ID')
  }
  await rewardService.deleteById(id)
  return res.status(204).send()
}

export const calculateReward = async (req: Request, res: Response) => {
    const rewardId = parseInt(req.query.id as string, 10)
    const input = parseInt(req.query.input as string, 10)
    if (isNaN(rewardId) || isNaN(input)) {
    throw new ErrorWithStatus(400, '缺少奖励ID或输入值')
  }
  const result = await rewardService.calculateReward(rewardId, input)
  return res.status(200).json({ result })
}
