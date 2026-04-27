import { Router } from 'express'
import { createTask } from '../controllers/task-controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router({ mergeParams: true} )

router.use(requireAuth)

router.post('/', createTask)

export default router
