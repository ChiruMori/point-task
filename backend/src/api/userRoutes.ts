import { Router } from 'express'
import * as userController from '../controllers/userController'
import { checkAuth } from '../middleware/auth'

const router = Router()

// 应用 checkAuth 中间件。所有这条路由下的请求都需要先通过它
router.use(checkAuth)

router.get('/get/:uid', userController.getUserById)

export default router
