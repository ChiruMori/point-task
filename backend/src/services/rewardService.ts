import { prisma } from '../db'
import { Reward } from 'shared'
import { ErrorWithStatus } from '../middleware/expHandler'

export const findRewardById = async (id: number) => {
  return prisma.reward.findUnique({
    where: { id },
  })
}

export const createReward = async (reward: Reward) => {
  return prisma.reward.create({
    data: reward,
  })
}

export const calculateReward = async (rewardId: number, input: number) => {
  const reward = await findRewardById(rewardId)
  if (!reward) {
    throw new ErrorWithStatus(404, '奖励规则不存在')
  }
  if (input > reward.maxInput || input < reward.minInput) {
    throw new ErrorWithStatus(400, '输入数值超出设定范围')
  }
  // 执行 fx 字段的函数，该函数接受一个参数，名称为 x
  const func = new Function('x', reward.fx)
  return func(input)
}

export const deleteById = async (id: number) => {
  return prisma.reward.delete({
    where: { id },
  })
}