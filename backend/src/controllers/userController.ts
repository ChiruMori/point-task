import { Request, Response } from 'express'
import * as userService from '../services/userService'

const REQ_HEADER_TOKEN = 'x-auth-token'

export const getUserById = async (req: Request, res: Response) => {
  try {
    const uid = parseInt(req.params.uid, 10)
    if (isNaN(uid)) {
      return res.status(400).json({ message: '非法用户ID' })
    }

    // 拦截未登录请求（Token）
    const requestToken = req.headers[REQ_HEADER_TOKEN] as string
    if (!requestToken) {
      return res.status(401).json({ message: '请登录' })
    }
    // 校验 Token
    if (userService.invalidateToken(requestToken)) {
      return res.status(401).json({ message: '登录已过期，请重新登录' })
    }

    // 权限检查的预留位置
    // const requesterId = (req as any).user.id;
    // if (requesterId !== uid && requesterRole !== 'parent') {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    const user = await userService.findUserById(uid)

    if (!user) {
      return res.status(404).json({ message: '用户未找到' })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: '内部服务器错误' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: '内部服务器错误' })
  }
}
