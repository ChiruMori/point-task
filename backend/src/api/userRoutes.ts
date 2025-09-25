import { Router } from 'express'
import * as userController from '../controllers/userController'

const router = Router()

router.get('/get', userController.getUserById)
router.post('/login', userController.login)

export default router
