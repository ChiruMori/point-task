import { prisma } from '../db'
import { User } from 'shared'
import crypto from 'crypto'
import { ErrorWithStatus } from '../middleware/expHandler'
import logger from '../utils/logger'

type UserSession = {
  user: User
  expiry: number
}

export const findUserById = async (
  id: number
): Promise<Omit<User, 'pwd'> | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      // 只选择需要的字段，排除密码
      id: true,
      uname: true,
      role: true,
      point: true,
    },
  })

  // Prisma's select会自动匹配类型，但我们显式转换一下以符合共享类型
  return user as User | null
}

export const findUserByCredentials = async (
  username: string,
  password: string
): Promise<Omit<User, 'pwd'> | null> => {
  // 密码规则：md5(pwd+username+'salt')
  const pwd_hash = crypto
    .createHash('md5')
    .update(password + username + 'salt')
    .digest('hex')
  logger.info(`Authenticating user ${username} with hash ${pwd_hash}`)
  const user = await prisma.user.findUnique({
    where: { uname: username, pwd: pwd_hash },
    select: {
      // 只选择需要的字段，排除密码
      id: true,
      uname: true,
      role: true,
      point: true,
    },
  })

  return user as User | null
}

const tokenExpiryMap: Map<string, UserSession> = new Map()
export const generateToken = (user: Omit<User, 'pwd'>): string => {
  // 伪实现：直接返回用户ID作为token
  // 需替换为真正的 JWT token 生成
  const token = user.id.toString()
  tokenExpiryMap.set(token, { user, expiry: Date.now() + 30 * 60 * 1000 }) // 30分钟
  return token
}
export const validateToken = (token: string): UserSession | null => {
  // 临时方案：内存中存储 id 对应的有效时间戳，超时的视为无效，每次验证时刷新
  const session = tokenExpiryMap.get(token)
  if (!session) {
    return null
  }

  const isExpired = Date.now() > session.expiry
  if (isExpired) {
    tokenExpiryMap.delete(token)
  } else {
    // 刷新有效期
    tokenExpiryMap.set(token, {
      user: session.user,
      expiry: Date.now() + 30 * 60 * 1000,
    }) // 30分钟
  }

  return isExpired ? null : session
}

export const addPoints = async (userId: number, points: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new ErrorWithStatus(404, '用户不存在')
  }
  const newPoint = user.point + points
  if (newPoint < 0) {
    throw new ErrorWithStatus(400, '积分不足')
  }
  await prisma.user.update({
    where: { id: userId },
    data: { point: newPoint },
  })
  return newPoint
}

export const listUsers = async (): Promise<Omit<User, 'pwd'>[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      uname: true,
      role: true,
      point: true,
    },
  })
  return users as Omit<User, 'pwd'>[]
}
