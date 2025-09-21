import { Request, Response } from 'express'
import * as userService from '../services/userService'

export const getUserById = async (req: Request, res: Response) => {
  try {
    const uid = parseInt(req.params.uid, 10)
    if (isNaN(uid)) {
      return res.status(400).json({ message: 'Invalid user ID' })
    }

    // 权限检查的预留位置
    // const requesterId = (req as any).user.id;
    // if (requesterId !== uid && requesterRole !== 'parent') {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    const user = await userService.findUserById(uid)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
