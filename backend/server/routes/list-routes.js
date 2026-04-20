import { Router } from 'express'
import { createList } from '../controllers/list-controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.use(requireAuth)

router.post('/:id', createList)

export default router
