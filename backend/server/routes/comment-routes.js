import { Router } from 'express'
import { createComment, showComment } from '../controllers/comment-controller.js'
import { requireAuth } from '../middlewares/auth.js'
import { showBoard } from '../controllers/board-controller.js'

const router = Router({ mergeParams: true} )

router.use(requireAuth)

router.post('/', createComment)
// router.get('/', showTasks)

// router.patch('/action/reorder', updateTasksOrder)

router.get('/:commentId', showComment)
// router.patch('/:taskId', modifyTask)
// router.delete('/:taskId', softDeleteTask)

export default router
