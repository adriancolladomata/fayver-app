import { BoardModel } from '../models/board-model.js'
import { ListModel } from '../models/list-model.js'
import { validateList, validatePartialList, validateReorder } from '../schemas/list-schema.js'
import { randomUUID } from 'node:crypto'

// Función para la creación de una lista
export const createList = async (req, res) => {
  // Instanciación de los elementos necesario
  const ownerId = req.user.id
  const { boardId } = req.params
  // Validación mediante el uso del list-schema (zod)
  const validation = validateList(req.body)

  // Si la validación no es exitosa, lanzamos un error
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors})
  }

  try {
    // Instanciamos el nombre y el color procedentes de la validacion
    const { name, color } = validation.data

    // Si no hay ID del tablon, lanzamos un error
    Validation.noBoardId(boardId)

    // Instanciamos el tablon y comprobamos si existe
    const board = await BoardModel.getBoard(boardId, ownerId)
    Validation.noBoard(board)

    // Creamos un randomUUID para el id
    const listId = randomUUID()
    // Creamos y asignamos el orden como el resultado de la suma de la obtencion del orden de la ultima lista + 1
    const order = await ListModel.getLastOrder(boardId) + 1

    // Creamos la lista
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
  // Instanciación de las variables necesarias
  const { boardId, listId } = req.params
  const ownerId = req.user.id

  // Validación parcial de Zod (pueden venir todos los campos o solo uno)
  const validation = validatePartialList(req.body)

  // si la validación no es exitosa, lanza un error
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors })
  }

  try {
    // Validaciones de existencia del tablón y de la lista
    Validation.noBoardId(boardId)
    const board = await BoardModel.getBoard(boardId, ownerId)
    Validation.noBoard(board)
    Validation.isDeleted(board)

    Validation.noListId(listId)
    const list = await ListModel.getList(listId, boardId)
    Validation.noList(list)
    Validation.isDeleted(list)

    // Separación de campos: el 'order' se maneja aparte del resto
    // separamos el orden de los demas por que cambiar, por ejemplo el nombre, solo cambia una lista, pero cambiar el orden cambia todas
    const { order: newOrder, ...otherFields } = validation.data
    // Booleano para indicar si la lista ha sido reordenada o no
    let hasReordered = false

    // Lógica de reordenamiento (Drag & Drop)
    // Si newOrder ha cambiado, entramos en el condicional
    if (newOrder !== undefined && newOrder !== list.order) {
      // Instanciación de todas las listas del tablon
      let allLists = await ListModel.getLists(boardId)

      // Obtención de la lista a mover mediante el metodo find
      const listToMove = allLists.find(element => element.id === listId)
      // Si se encuentra la lista, ejecuta el condicional
      if (listToMove) {
        // allLists ahora no contiene la lista a mover gracias al filter
        allLists = allLists.filter(element => element.id !== listId)

        // El splice maneja el desplazamiento de los demás automáticamente
        allLists.splice(newOrder, 0, listToMove)

        // Con un map hacemos un reorder de todas las listas
        const reorderData = allLists.map((element, index) => ({
          id: element.id,
          order: index
        }))

        // Ejecutamos el reorder y marcamos el booleano como true
        await ListModel.reorderLists(boardId, reorderData)
        hasReordered = true
      }
    }

    // Logíca de actualización del resto de campos sin order
    // Instanciación de un booleano para saber si se han modificado los campos
    let hasModifiedFields = false
    // Object.keys() pregunta si hay algo dentro de es epaquete, es decir, si el usuario solo movio el ordern su longitud sera de 0
    // si movió algo mas, será mayor de 0, y entrará en el condicional
    if (Object.keys(otherFields).length > 0) {
      // Modificación de la lista
      const result = await ListModel.modifyList(listId, boardId, otherFields)
      // Si ha ocurrido la modificación, asignamos el booleano a true
      if (result.affectedRows > 0) {
        hasModifiedFields = true
      }
    }

    // Si no ha ocurrido ninguna de las dos acciones, enviamos un mensaje como feedback
    if (!hasReordered && !hasModifiedFields) {
      return res.status(400).json({
        message: 'No se realizaron cambios (los datos enviados coinciden con los actuales o están vacíos)'
      })
    }

    // Enviamos una respuesta exitosa con el objeto actualizado
    // Combinamos los datos viejos (list) + cambios enviados (validation.data)
    const updatedList = {
      ...list,
      ...validation.data
    }

    // Return con la lista modificada y sus cambios
    return res.status(200).json({
      message: 'Lista modificada con éxito',
      list: updatedList
    })

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// Función para reordenar todas las listas directamente (Drag & Drop relacionado en el Front-end)
export const updateListsOrder = async (req, res) => {
  // Instanciación
  const { boardId } = req.params
  const ownerId = req.user.id

  // Validamos que el body sea un array de: { id: string, order: number }
  const validation = validateReorder(req.body)

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors })
  }

  try {

    // Verificamos que existe un ID del talon enviado
    Validation.noBoardId(boardId)
    // Instanciamos el tablon
    const board = await BoardModel.getBoard(boardId, ownerId)
    // Verificamos que el tablón existe
    Validation.noBoard(board)
    Validation.isDeleted(board)

    // Ejecutamos la transacción masiva directamente
    // validation.data ya es el array limpio de objetos [{id, order}, ...]
    await ListModel.reorderLists(boardId, validation.data)

    return res.status(200).json({
      message: 'Orden del tablón actualizado correctamente'
    })

  } catch (error) {
    return res.status(500).json({
      message: 'Error al procesar el reordenamiento: ' + error.message
    })
  }
}

export const softDeleteList = async (req, res) => {
  const { boardId, listId } = req.params
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

    const result = await ListModel.deleteList(listId, boardId)

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'No ha sido posible eliminar la lista '})
    }

    const remainingLists = await ListModel.getLists(boardId)
    const reorderData = remainingLists.map((element, index) => ({
      id: element.id,
      order: index
    }))

    // Si quedan listas, aplicamos el reordenamiento
    if (reorderData.length > 0) {
      await ListModel.reorderLists(boardId, reorderData)
    }

    return res.status(200).json({ message: 'Lista eliminada' })
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
