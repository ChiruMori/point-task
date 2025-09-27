import { Router } from 'express'
import * as recordController from '../controllers/recordController'
import { asyncHandler } from '../middleware/expHandler'

const router = Router()

router.get('/get', asyncHandler(recordController.getRecordById))
router.get('/page', asyncHandler(recordController.pageRecords))
router.post('/create', asyncHandler(recordController.createRecord))
router.delete('/delete', asyncHandler(recordController.deleteRecord))

export default router
