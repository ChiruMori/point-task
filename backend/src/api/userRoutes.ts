import { Router } from 'express'
import * as userController from '../controllers/userController'
import { asyncHandler } from '../middleware/expHandler'

const router = Router()

router.get('/get', asyncHandler(userController.getUserById))
router.post('/login', asyncHandler(userController.login))
router.post('/addPoints', asyncHandler(userController.addPoints))
router.get('/list', asyncHandler(userController.listUsers))

export default router
