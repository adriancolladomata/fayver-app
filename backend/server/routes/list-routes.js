import { Router } from 'express'
import { createList, modifyList, showList, showLists, updateListsOrder, softDeleteList } from '../controllers/list-controller.js'
import { requireAuth } from '../middlewares/auth.js'

// Con mergeParams router de listas se conecta con el de boards. req.params ahora contiene { boardId: '...' }.
const router = Router({ mergeParams: true} )

router.use(requireAuth)

router.post('/', createList)
router.get('/', showLists)
router.patch('/action/reorder', updateListsOrder)
router.get('/:listId', showList)
router.patch('/:listId', modifyList)
router.delete('/:listId', softDeleteList)

export default router
