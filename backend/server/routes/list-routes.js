import { Router } from 'express'
import { createList, showList, showLists } from '../controllers/list-controller.js'
import { requireAuth } from '../middlewares/auth.js'

// Con mergeParams router de listas se conecta con el de boards. req.params ahora contiene { boardId: '...' }.
const router = Router({ mergeParams: true} )

router.use(requireAuth)

router.post('/', createList)
router.get('/:listId', showList)
router.get('/', showLists)

export default router
