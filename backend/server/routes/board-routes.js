import { Router } from 'express'
import { create, showBoards, showBoard, modifyBoard, softDeleteBoard } from '../controllers/board-controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.post('/', requireAuth, create)
router.get('/', requireAuth, showBoards)
router.get('/:id', requireAuth, showBoard)
router.put('/:id', requireAuth, modifyBoard)
router.put('/:id', requireAuth, softDeleteBoard)

export default router
