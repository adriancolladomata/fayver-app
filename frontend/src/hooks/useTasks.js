import { useCallback } from 'react'
import { useLists } from '../context/ListContext'
import { createTaskReq, deleteTaskReq, updateTaskReq } from '../services/taskService'

export const useTasks = (boardId) => {
  const { setLists } = useLists()

  // CREAR TAREA
  const createTask = useCallback(async (listId, name) => {
    try {
      const response = await createTaskReq(boardId, listId, { name })

      // Añadimos la tarea directamente al estado local
      setLists(prevLists => prevLists.map(list =>
        list.id === listId
          ? { ...list, tasks: [...(list.tasks || []), response] } // Asume que el backend devuelve la tarea creada
          : list
      ))
      return response
    } catch (err) {
      console.error('Error al crear tarea:', err)
      throw err
    }
  }, [boardId, setLists])

  // ELIMINAR TAREA
  const deleteTask = useCallback(async (listId, taskId) => {
    try {
      await deleteTaskReq(boardId, listId, taskId)

      setLists(prevLists => prevLists.map(list =>
        list.id === listId
          ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
          : list
      ))
    } catch (err) {
      console.error('Error al eliminar tarea:', err)
      throw err
    }
  }, [boardId, setLists])

  // 3. ACTUALIZAR CUALQUIER CAMPO DE LA TAREA (Nombre, descripción, is_completed, etc.)
  const updateTask = useCallback(async (listId, taskId, fieldsToUpdate) => {
    try {
      await updateTaskReq(boardId, listId, taskId, fieldsToUpdate)

      // Modificamos selectivamente los campos en el estado de React
      setLists(prevLists => prevLists.map(list =>
        list.id === listId
          ? {
            ...list,
            tasks: list.tasks.map(task =>
              task.id === taskId ? { ...task, ...fieldsToUpdate } : task
            )
          }
          : list
      ))
    } catch (err) {
      console.error('Error al actualizar tarea:', err)
      throw err
    }
  }, [boardId, setLists])

  return {
    createTask,
    deleteTask,
    updateTask
  }

}
