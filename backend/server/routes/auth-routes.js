import { Router } from 'express'
import { register, login, logout } from '../controllers/auth-controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.post('/register', (req, res) => {
  console.log('REGISTER HIT')
  res.json({ ok: true })
})
router.post('/login', login)
router.post('/logout', requireAuth, logout)
router.get('/me', requireAuth) // -> Hay que completarlo

export default router
