import { BoardModel } from '../models/board-model.js'
import { ListModel } from '../models/list-model.js'
import { randomUUID } from 'node:crypto'

export const createList = async (req, res) => {
  const { name } = req.body

  try {
    Validation.name(name)

    const board_id = req.params
    const owner_id = req.user.id

    const board = await BoardModel.getBoard(board_id, owner_id)

    Validation.noBoard(board)
    Validation.isDeleted(board)

    const list_id = randomUUID()
    const order = await ListModel.getLastOrder(board_id)
    const color = req.body ?? '#cccccc'

    await ListModel.create(list_id, name, owner_id, order, color)

    return res.status(201).json({ message: 'Lista creada' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
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

  static noBoard (board) {
    if (!board) throw new Error ('Tablón no encontrado')
  }
}
