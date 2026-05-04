import { Router } from 'express'
import { register, login, logout, getMe } from '../controllers/auth-controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', requireAuth, logout)
router.get('/me', requireAuth, getMe) // -> Hay que completarlo

export default router
