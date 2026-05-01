import { Router } from 'express'
import { createTask, modifyTask, showTask, showTasks, softDeleteTask, updateTasksOrder } from '../controllers/task-controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router({ mergeParams: true} )

router.use(requireAuth)

router.post('/', createTask)
router.get('/', showTasks)

router.patch('/action/reorder', updateTasksOrder)

router.get('/:taskId', showTask)
router.patch('/:taskId', modifyTask)
router.delete('/:taskId', softDeleteTask)

export default router
