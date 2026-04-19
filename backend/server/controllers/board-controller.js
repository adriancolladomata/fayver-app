
import { BoardModel } from '../models/board-model.js'
import { randomUUID } from 'node:crypto'

export const create = async (req, res) => {
  const { name } = req.body

  try {
    Validation.name(name)

    const id = randomUUID()
    const owner_id = req.user.id
    const share_token = randomUUID()

    await BoardModel.createBoard(id, name, owner_id, share_token)

    return res.status(201).json({ message: 'Tablón creado con éxito' })
  } catch (error) {
    return res.status(500).json({ message: 'No se ha podido crea el tablón' })
  }
}

export const showBoards = async (req, res) => {
  const owner_id = req.user.id

  try {
    const boards = await BoardModel.getBoards(owner_id)

    res.json(boards)
  } catch (error) {
    return res.status(500).json('No se pudieron mostrar los tablones')
  }
}

export const showBoard = async (req, res) => {
  const { id } = req.params
  const owner_id = req.user.id

  try {
    const board = await BoardModel.getBoard(id, owner_id)

    res.json(board)
  } catch (error) {
    return res.status(500).json('No se pudo mostrar el tablón')
  }
}

export const modifyBoard = async (req, res) => {
  const { id } = req.params
  const { name } = req.body
  const owner_id = req.user.id

  try {
    Validation.name(name)

    const result = await BoardModel.updateBoard(id, name, owner_id)
    const board = await BoardModel.getBoard(id, owner_id)

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tablón no encontrado' })
    }

    return res.status(202).json({ message: 'Tablón modificado con éxito', board})
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const softDeleteBoard = async (req, res) => {
  const { id } = req.params
  const owner_id = req.user.id

  try {
    const result = await BoardModel.softDeleteBoard(id, owner_id)
    const board = await BoardModel.getBoard(id, owner_id)

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tablón no encontrado' })
    }

    return res.status(202).json({ message: 'Tablón eliminadoo', board})
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

class Validation {
  static name (name) {
    if (typeof name !== 'string') throw new Error ('El nombre tiene que ser una cadena de texto')
    if (name.length < 3) throw new Error ('El nombre tiene que tener un mínimo de 3 carácteres')
  }
}
