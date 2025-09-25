import { Request, Response, NextFunction } from 'express'

import logger from '../utils/logger'

export const ErrorWithStatus = class extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export const expHandler = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path

  logger.info(`访问 URL: ${path}`)
  try {
    next()
  } catch (error) {
    if (error instanceof ErrorWithStatus) {
      return res.status(error.status).json({ message: error.message })
    }
    logger.error(`处理请求 ${path} 时出错: ${error}`)
    res.status(500).json({ message: '内部服务器错误' })
  }
}
