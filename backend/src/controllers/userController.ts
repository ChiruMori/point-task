import { Request, Response } from 'express'
import * as userService from '../services/userService'
import { ErrorWithStatus } from '../middleware/expHandler'
import { User } from 'shared'

export const getUserById = async (req: Request, res: Response) => {
  let uid = parseInt(req.query.uid as string, 10)
  if (isNaN(uid)) {
    uid = (req as any).user.id as number
  }

  const user = await userService.findUserById(uid)

  if (!user) {
    throw new ErrorWithStatus(404, '用户未找到')
  }

  return res.status(200).json({ user })
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    throw new ErrorWithStatus(400, '必须提供用户名或密码')
  }

  const user = await userService.findUserByCredentials(username, password)
  if (!user) {
    throw new ErrorWithStatus(401, '用户名或密码错误')
  }

  // 生成并返回JWT
  const token = userService.generateToken(user)
  return res.status(200).json({ token })
}

export const addPoints = async (req: Request, res: Response) => {
  const { userId, points } = req.body
  if (typeof userId !== 'number' || typeof points !== 'number') {
    throw new ErrorWithStatus(400, '必须提供用户ID和积分数')
  }
  const newPoint = await userService.addPoints(userId, points)
  return res.status(200).json({ newPoint })
}
