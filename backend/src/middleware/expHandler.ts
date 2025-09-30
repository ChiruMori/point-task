import { Request, Response, NextFunction } from 'express'

import logger from '../utils/logger'

export const ErrorWithStatus = class extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`处理请求 ${req.path} 时出错:`, error)

  if (error instanceof ErrorWithStatus) {
    return res.status(error.status).json({
      errno: error.status,
      message: error.message,
    })
  }

  // 默认服务器错误
  res.status(500).json({
    errno: 500,
    message: '内部服务器错误',
  })
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
