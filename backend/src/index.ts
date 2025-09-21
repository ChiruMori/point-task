import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './api/userRoutes'

dotenv.config()

const app = express()
// 使用3001端口，避免和React的3000冲突
const port = process.env.PORT || 3001

// 允许跨域请求
app.use(cors())
// 解析JSON请求体
app.use(express.json())

// 心跳接口
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'UP', time: new Date().toISOString() })
})

// 集成API路由
app.use('/api/user', userRoutes)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
