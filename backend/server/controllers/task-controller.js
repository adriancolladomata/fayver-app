import { BoardModel } from '../models/board-model.js'
import { ListModel } from '../models/list-model.js'
import { TaskModel } from '../models/task-model.js'
import { validateTask } from '../schemas/task-schema.js'
import { randomUUID } from 'node:crypto'

export const createTask = async (req, res) => {
  const { boardId, listId } = req.params
  const ownerId = req.user.id
  const validation = validateTask(req.body)

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors})
  }

  try {
    Validation.noBoardId(boardId)
    const board = await BoardModel.getBoard(boardId, ownerId)
    Validation.noBoard(board)
    Validation.isDeleted(board)

    Validation.noListId(listId)
    const list = await ListModel.getList(listId, boardId)
    Validation.noList(list)
    Validation.isDeleted

    const taskId = randomUUID()
    const { name } = validation.data
    const order = await TaskModel.getLastOrder(listId) + 1

    await TaskModel.createTask(taskId, listId, name, order)

    return res.status(201).json({
      message: 'Tarea creada',
      id: taskId,
      name: name
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getTask = async (req, res) => {
  const { boardId, listId, taskId } = req.params
  const ownerId = req.user.id

  try {
    Validation.noBoardId(boardId)
    const board = await BoardModel.getBoard(boardId, ownerId)
    Validation.noBoard(board)
    Validation.isDeleted(board)

    Validation.noListId(listId)
    const list = await ListModel.getList(listId, boardId)
    Validation.noList(list)
    Validation.isDeleted(list)

    // Seguir por aqui con la obtencion, validacion y retorno de la tarea

  } catch (error) {

  }
}

// Clase Validation para optimización de código
class Validation {
  static isDeleted (element) {
    if (element.deleted_at !== null) throw new Error ('El elemento se encuentra eliminado desde: ' + element.deleted_at)
  }

  static noBoardId (boardId) {
    if (!boardId) throw new Error ('Se requiere el ID del tablón')
  }

  static noBoard (board) {
    if (!board) throw new Error ('Tablón no encontrado')
  }

  static noListId (listId) {
    if (!listId) throw new Error ('Se requiere el ID de la lista')
  }

  static noList (list) {
    if (!list) throw new Error ('Lista no encontrado')
  }
}
