import { BoardModel } from '../models/board-model.js'
import { ListModel } from '../models/list-model.js'
import { randomUUID } from 'node:crypto'
import { modifyBoard } from './board-controller.js'

export const createList = async (req, res) => {
  const { name } = req.body
  const { color } = req.body ?? '#ffffff'
  const ownerId = req.user.id
  const { boardId } = req.params

  try {
    Validation.name(name)
    Validation.noBoardId(boardId)

    const board = await BoardModel.getBoard(boardId, ownerId)

    Validation.noBoard(board)

    const listId = randomUUID()
    const order = await ListModel.getLastOrder(boardId) + 1

    await ListModel.createList(listId, name, boardId, order, color)

    return res.status(201).json({ message: 'Lista creada' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const showList = async (req, res) => {
  const { boardId, listId } = req.params
  const ownerId = req.user.id

  try {
    Validation.noBoardId(boardId)
    Validation.noListId(listId)

    const board = await BoardModel.getBoard(boardId, ownerId)

    Validation.noBoard(board)
    Validation.isDeleted(board)

    const list = await ListModel.getList(listId, boardId)

    Validation.noList(list)
    Validation.isDeleted(list)

    res.json(list)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const showLists = async (req, res) => {
  const { boardId } = req.params
  const ownerId = req.user.id

  try {
    Validation.noBoardId(boardId)

    const board = await BoardModel.getBoard(boardId, ownerId)

    Validation.noBoard(board)
    Validation.isDeleted(board)

    const lists = await ListModel.getLists(boardId)

    res.json(lists)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const modifyList = async (req, res) => {
  // Seguir por aqui y revisar modifyList del ListModel
}

// Clase Validation para optimización de código
class Validation {
  // Validación del nombre introducido del tablón
  static name (name) {
    if (typeof name !== 'string') throw new Error ('El nombre tiene que ser una cadena de texto')
    if (name.length < 3) throw new Error ('El nombre tiene que tener un mínimo de 3 carácteres')
  }

  static isDeleted (board) {
    if (board.deleted_at !== null) throw new Error ('El tablón se encuentra eliminado desde: ' + board.deleted_at)
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
