import { Router } from 'express'
import { createTask, showTask, showTasks } from '../controllers/task-controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router({ mergeParams: true} )

router.use(requireAuth)

router.post('/', createTask)
router.get('/', showTasks)

router.get('/:taskId', showTask)

export default router
