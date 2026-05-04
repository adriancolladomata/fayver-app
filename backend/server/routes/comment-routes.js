import { Router } from 'express'
import { createComment, deletComment, modifyComment, showComment, showComments } from '../controllers/comment-controller.js'
import { requireAuth } from '../middlewares/auth.js'
import { showBoard } from '../controllers/board-controller.js'

const router = Router({ mergeParams: true} )

router.use(requireAuth)

router.post('/', createComment)
router.get('/', showComments)

router.get('/:commentId', showComment)
router.patch('/:commentId', modifyComment)
router.delete('/:commentId', deletComment)

export default router
