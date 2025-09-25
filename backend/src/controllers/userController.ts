import { Request, Response } from 'express'
import * as userService from '../services/userService'

export const getUserById = async (req: Request, res: Response) => {
  const uid = parseInt(req.params.uid, 10)
  if (isNaN(uid)) {
    return res.status(400).json({ message: '非法用户ID' })
  }

  const user = await userService.findUserById(uid)

  if (!user) {
    return res.status(404).json({ message: '用户未找到' })
  }

  return res.status(200).json(user)
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: '必须提供用户名或密码' })
  }

  const user = await userService.findUserByCredentials(username, password)
  if (!user) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }

  // 生成并返回JWT
  const token = userService.generateToken(user)
  return res.status(200).json({ token })
}
