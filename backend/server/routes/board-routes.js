import { Router } from 'express'
import { create, showBoards, showBoard, modifyBoard, softDeleteBoard } from '../controllers/board-controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.use(requireAuth)

router.post('/', create)
router.get('/', showBoards)
router.get('/:id', showBoard)
router.put('/:id', modifyBoard)
router.delete('/:id', softDeleteBoard)

export default router
