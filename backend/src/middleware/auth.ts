import { Request, Response, NextFunction } from 'express';

// 伪实现：从请求头获取用户ID，并附加到请求对象上
// 未来这里会替换为真正的 JWT token 解析和验证
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id']; // 假设前端请求时会带上这个头

  // 在这里拓展 UserId 校验
  // if (!userId || typeof userId !== 'string') {
  //   return res.status(401).json({ message: 'Unauthorized: Missing user identity' });
  // }

  // 这里可以添加一个自定义类型声明来让 TypeScript 知道 req.user 存在
  // (req as any).user = { id: parseInt(userId, 10) };

  console.log(`Authenticated user: ${userId}`);
  next();
};