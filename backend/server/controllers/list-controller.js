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

    const { order: newOrder, ...otherFields } = validation.data

    // Si la el orden de la lista ha cambiado, entramos en el condicional
    if (newOrder !== undefined && newOrder !== list.order) {
      // Obtenemos todas las listas del tablón
      let allLists = await ListModel.getLists(boardId)

      // Obtenemos la lista que vamos a mover mediante un find
      const listToMove = allLists.find(l => l.id === listId)
      // Modificamos allLists para que no contenga la lista que vamos a mover con un filter
      allLists = allLists.filter(l => l.id !== listId)

      // Insertamos la lista en la nueva posición. Splice maneja el desplazamiento de los demás automáticamente.
      // (posicion donde se inserta, elementos a borrar, elemento a insertar)
      allLists.splice(newOrder, 0, listToMove)

      // Generamos el nuevo mapa de órdenes con un .map que recorrerá cada lista (0, 1, 2...)
      const reorderData = allLists.map((l, index) => ({
        id: l.id,
        order: index
      }))

      // Aplicamos el reordenamiento en una transacción
      await ListModel.reorderLists(boardId, reorderData)
    }

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
      return res.json({ message: 'No ha sido posible eliminar la lista '})
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
