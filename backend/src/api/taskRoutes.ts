import { Router } from 'express'
import * as taskController from '../controllers/taskController'
import { asyncHandler } from '../middleware/expHandler'

const router = Router()

router.get('/get', asyncHandler(taskController.getTaskById))
router.get('/list', asyncHandler(taskController.listTasks))
router.put('/update', asyncHandler(taskController.updateTask))
router.delete('/delete', asyncHandler(taskController.deleteTask))
router.post('/create', asyncHandler(taskController.createTask))

export default router
