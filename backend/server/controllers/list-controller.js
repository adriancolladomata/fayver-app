import { BoardModel } from '../models/board-model.js'
import { ListModel } from '../models/list-model.js'
import { validateList, validatePartialList } from '../schemas/list-schema.js'
import { randomUUID } from 'node:crypto'

export const createList = async (req, res) => {
  const ownerId = req.user.id
  const { boardId } = req.params
  const validation = validateList(req.body)

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors})
  }

  try {
    const { name, color } = validation.data

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
    Validation.issDeleted(board)

    const lists = await ListModel.getLists(boardId)
    res.json(lists)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const modifyList = async (req, res) => {
  // Instanciación de las variables necesarias
  const { boardId, listId } = req.params
  const ownerId = req.user.id
  // Realización de la validación de los valores recibidos en el body (Partial por que pueden estar o
  // no ya que es un Update y no hay por que modificar todos los valores de la lista)
  const validation = validatePartialList(req.body)

  // Si la validación no es exitosa, lanza un error
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors})
  }

  try {
    // Validación si no hay boardId como parámetro en la URL 
    Validation.noBoardId(boardId)

    // Obtención del tablón
    const board = await BoardModel.getBoard(boardId, ownerId)
    // Validación para saber si hay tablón o no y si está eliminado
    Validation.noBoard(board)
    Validation.isDeleted(board)

    // Validación si no hay listId como parámetro en la URL
    Validation.noListId(listId)

    // Obtencion de la lista
    const list = await ListModel.getList(listId, boardId)
    // Validación para saber si hay lista o no y si está eliminada
    Validation.noList(list)
    Validation.isDeleted(list)

    // Modificación de la lista
    // Gracias al instanciarse como objetos en el model, no se requiere de orden por lo que podemos pasar validation.data de manera directa
    const result = await ListModel.modifyList(listId, boardId, validation.data)

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'No se pudieron realizar cambios' })
    }

    // Respuesta con datos actualizados, cobinamos los datos viejos con los nuevos
    const updatedList = { ...list, ...validation.data}

    return res.status(200).json({ message: 'Lista modificada con éxito ', list: updatedList })
  } catch (error) {
    return res.status(500).json({ message: error.message })
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
