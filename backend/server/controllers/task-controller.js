import { BoardModel } from '../models/board-model.js'
import { ListModel } from '../models/list-model.js'
import { TaskModel } from '../models/task-model.js'
import { validatePartialTask, validateTask, validateReorderTasks } from '../schemas/task-schema.js'
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

export const showTask = async (req, res) => {
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

    Validation.noTask(taskId)
    const task = await TaskModel.getTask(taskId, listId)
    Validation.noTask(task)
    Validation.isDeleted(task)

    res.json(task)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const showTasks = async (req, res) => {
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

    const tasks = await TaskModel.getTasks(listId)

    res.json(tasks)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const modifyTask = async (req, res) => {
  const { boardId, listId, taskId } = req.params
  const ownerId = req.user.id
  const validation = validatePartialTask(req.body)

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
    Validation.isDeleted(list)

    Validation.noTask(taskId)
    const task = await TaskModel.getTask(taskId, listId)
    Validation.noTask(task)
    Validation.isDeleted(task)

    const { order: newOrder, ...otherFields } = validation.data
    let hasReordered = false

    if (newOrder !== undefined && newOrder !== task.order) {
      let allTasks = await TaskModel.getTasks(listId)

      const taskToMove = allTasks.find(element => element.id === taskId)

      if (taskToMove) {
        allTasks = allTasks.filter(element => element.id !== taskId)

        allTasks.splice(newOrder, 0, taskToMove)

        const reorderData = allTasks.map((element, index) => ({
          id: element.id,
          order: index
        }))

        await TaskModel.reorderTasks(listId, reorderData)
        hasReordered = true
      }
    }

    let hasModifiedFields = false

    if (Object.keys(otherFields).length > 0) {
      // Modificación de la tarea
      const result = await TaskModel.modifyTask(taskId, listId, otherFields)
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
    const updatedTask = {
      ...task,
      ...validation.data
    }

    // Return con la lista modificada y sus cambios
    return res.status(200).json({
      message: 'Tarea modificada con éxito',
      list: updatedTask
    })

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// Función para reordenar todas las listas directamente (Drag & Drop relacionado en el Front-end)
export const updateTasksOrder = async (req, res) => {
  // Instanciación
  const { boardId, listId } = req.params
  const ownerId = req.user.id

  // Validamos que el body sea un array de: { id: string, order: number }
  const validation = validateReorderTasks(req.body)

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten().fieldErrors })
  }

  try {

    Validation.noBoardId(boardId)
    const board = await BoardModel.getBoard(boardId, ownerId)
    Validation.noBoard(board)
    Validation.isDeleted(board)

    Validation.noListId(listId)
    const list = await ListModel.getList(listId, boardId)
    Validation.noList(list)
    Validation.isDeleted(list)

    // Ejecutamos la transacción masiva directamente
    // validation.data ya es el array limpio de objetos [{id, order}, ...]
    await TaskModel.reorderTasks(listId, validation.data)

    return res.status(200).json({
      message: 'Orden de las tareas actualizado correctamente'
    })

  } catch (error) {
    return res.status(500).json({
      message: 'Error al procesar el reordenamiento: ' + error.message
    })
  }
}

export const softDeleteTask = async (req, res) => {
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

    Validation.noTask(taskId)
    const task = await TaskModel.getTask(taskId, listId)
    Validation.noTask(task)
    Validation.isDeleted(task)

    const result = await TaskModel.deleteTask(taskId, listId)

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'No ha sido posible eliminar la tarea '})
    }

    // Reordenanza de las tareas. Al borrar una, las que quedan deben cubrir el hueco del 'order'
    const remainingTasks = await TaskModel.getTasks(listId)
    const reorderData = remainingTasks.map((element, index) => ({
      id: element.id,
      order: index
    }))

    // Si quedan tareas, aplicamos el reordenamiento
    if (reorderData.length > 0) {
      await TaskModel.reorderTasks(listId, reorderData)
    }

    return res.status(200).json({ message: 'Tarea eliminada' })
  } catch (error) {
    return res.status(500).json({ message: error.message})
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
    if (!list) throw new Error ('Lista no encontrada')
  }

  static noTaskId (taskId) {
    if (!taskId) throw new Error ('Se requiere el ID de la tarea')
  }

  static noTask (task) {
    if (!task) throw new Error ('Tarea no encontrada')
  }
}
