import { prisma } from '../db'
import { User } from 'shared'

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
