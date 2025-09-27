import { Request, Response, NextFunction } from 'express'
import * as userService from '../services/userService'

import logger from '../utils/logger'

const REQ_HEADER_TOKEN = 'x-auth-token'
const LOGIN_WHITELIST = ['/api/health', '/api/user/login']
const ADMIN_ONLY_URLS = [
  '/api/user/addPoints',
  '/api/task/list',
  '/api/task/get',
  '/api/task/create',
  '/api/task/update',
  '/api/task/delete',
  '/api/reward/get',
  '/api/reward/create',
  '/api/reward/delete',
  '/api/reward/calculate',
  '/api/record/create',
  '/api/record/delete',
]

// 伪实现：从请求头获取用户ID，并附加到请求对象上
// 未来这里会替换为真正的 JWT token 解析和验证
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path
  if (LOGIN_WHITELIST.includes(path)) {
    logger.info(`白名单 URL: ${path}，已跳过登录验证`)
    return next()
  }
  // 拦截未登录请求（Token）
  const requestToken = req.headers[REQ_HEADER_TOKEN] as string
  if (!requestToken) {
    return res.status(401).json({ message: '请登录' })
  }
  // 校验 Token
  const session = userService.validateToken(requestToken)
  if (!session) {
    return res.status(401).json({ message: '无效的登录状态，请重新登录' })
  }
  // 权限检查
  if (ADMIN_ONLY_URLS.includes(path) && session.user.role !== 'admin') {
    return res.status(403).json({ message: '权限不足' })
  }

  // 用户信息写入请求对象，供后续中间件和路由使用
  ;(req as any).user = session.user

  logger.info(`Authenticated user: ${session.user.uname}`)
  next()
}
