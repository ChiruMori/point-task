import { Router } from 'express'
import * as rewardController from '../controllers/rewardController'
import { asyncHandler } from '../middleware/expHandler'

const router = Router()

router.get('/get', asyncHandler(rewardController.getRewardById))
router.post('/create', asyncHandler(rewardController.createReward))
router.delete('/delete', asyncHandler(rewardController.deleteReward))
router.get('/calculate', asyncHandler(rewardController.calculateReward))

export default router
