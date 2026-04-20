import { BoardModel } from '../models/board-model.js'
import { randomUUID } from 'node:crypto'

// Metodo para crear el tablón
export const create = async (req, res) => {
  // Obtención del nombre mediante el body de la request
  const { name } = req.body

  try {
    // Validacion del nombre
    Validation.name(name)

    // Instanciación del id con randomUUID(), owner_id mediante el token del usuario activo, y share_token con randomUUID()
    const id = randomUUID()
    const owner_id = req.user.id
    const share_token = randomUUID()

    // Creación del tablón
    await BoardModel.createBoard(id, name, owner_id, share_token)

    return res.status(201).json({ message: 'Tablón creado con éxito' })
  } catch (error) {
    return res.status(500).json({ message: 'No se ha podido crea el tablón' })
  }
}

// Método para mostrar todos los tablones de los que un usuario dispone
export const showBoards = async (req, res) => {
  // Obtención de owner_id mediatne el token del usuario activo
  const owner_id = req.user.id

  try {
    // Obtención de los tablones gracias a BoardModel, que contiene las consultas a la base de datos
    const boards = await BoardModel.getBoards(owner_id)

    // Muestra un json con todos los tablones
    res.json(boards)
  } catch (error) {
    return res.status(500).json('No se pudieron mostrar los tablones')
  }
}

// Método para mostrar un tablón seleccionado
export const showBoard = async (req, res) => {
  // Obtención de la id mediante parámetros de la url
  const { id } = req.params
  // Obtención de owner_id mediatne el token del usuario activo
  const owner_id = req.user.id

  try {
    // Obtención del tablon gracias a BoardModel.
    const board = await BoardModel.getBoard(id, owner_id)

    // Validaciones
    Validation.noBoard(board)
    Validation.isDeleted(board)

    // Muestra un json con todos los tablones
    res.json(board)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// Método para modificar un tablón
export const modifyBoard = async (req, res) => {
  // Obtención de la id mediante parámetros de la URL, del nombre mediante el body de la request, y el owner_id del token del usuario activo
  const { id } = req.params
  const { name } = req.body
  const owner_id = req.user.id

  try {
    // Validación del nombre
    Validation.name(name)

    // Obtención del resultado de la modificación y del tablón
    const result = await BoardModel.updateBoard(id, name, owner_id)
    const board = await BoardModel.getBoard(id, owner_id)

    Validation.isDeleted(board)

    // Si affectedRows (propiedad de result) es 0, entonces no se ha modificado ningun tablón, por lo que no se ha encontrado
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tablón no encontrado' })
    }

    return res.status(200).json({ message: 'Tablón modificado con éxito', board})
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// Método para eliminar parcialmente (Soft-Delete) un tablón
export const softDeleteBoard = async (req, res) => {
  // Obtención de la id mediante parámetros de la URL y el owner_id del token del usuario activo
  const { id } = req.params
  const owner_id = req.user.id

  try {
    // Obtención del tablón
    const board = await BoardModel.getBoard(id, owner_id)

    // Si el tablón no es null ya estaba eliminado
    Validation.isDeleted(board)

    // Obtención del result de la eliminación
    const result = await BoardModel.deleteBoard(id, owner_id)

    // Si affectedRows (propiedad de result) es 0, entonces no se ha modificado ningun tablón, por lo que no se ha encontrado
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tablón no encontrado' })
    }

    return res.status(200).json({ message: 'Tablón eliminado' })
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
