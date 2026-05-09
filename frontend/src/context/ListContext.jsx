import { createContext, useContext, useState, useCallback } from 'react'
import { getListsReq, createListReq, deleteListReq } from '../services/listService'
import { getTasksReq, createTaskReq, deleteTaskReq } from '../services/taskService'

const ListContext = createContext()

export const useLists = () => {
  const context = useContext(ListContext)
  if (!context) throw new Error('useLists debe usarse dentro de un ListProvider')
  return context
}

export const ListProvider = ({ children, boardId }) => {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)

  const loadLists = useCallback(async () => {
    try {
      setLoading(true)
      const listsData = await getListsReq(boardId)

      const listsWithTasks = await Promise.all(
        listsData.map(async (list) => {
          try {
            const tasks = await getTasksReq(boardId, list.id)
            return { ...list, tasks }
          } catch (err) {
            console.error(`Error cargando tareas de lista ${list.id}:`, err)
            return { ...list, tasks: [] }
          }
        })
      )

      setLists(listsWithTasks)
    } catch (err) {
      console.error('Error al cargar las listas:', err)
    } finally {
      setLoading(false)
    }
  }, [boardId])

  const createList = useCallback(async (name, color = '#ffffff') => {
    try {
      const response = await createListReq(boardId, { name, color })
      console.log('Respuesta del servidor:', response)
      // Recargar todas las listas para obtener la nueva
      await loadLists()
      return response
    } catch (err) {
      console.error('Error completo al crear lista:', err)
      throw err
    }
  }, [boardId, loadLists])

  const createTask = useCallback(async (listId, name) => {
    try {
      await createTaskReq(boardId, listId, { name })
      await loadLists()
    } catch (err) {
      console.error('Error al crear tarea:', err)
      throw err
    }
  }, [boardId, loadLists])

  const deleteList = useCallback(async (listId) => {
    try {
      await deleteListReq(boardId, listId)
      setLists(prevLists => prevLists.filter(list => list.id !== listId))
    } catch (err) {
      console.error('Error al eliminar lista:', err)
      throw err
    }
  }, [boardId])

  const deleteTask = useCallback(async (listId, taskId) => {
    try {
      await deleteTaskReq(boardId, listId, taskId)
      setLists(prevLists =>
        prevLists.map(list =>
          list.id === listId
            ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
            : list
        )
      )
    } catch (err) {
      console.error('Error al eliminar tarea:', err)
      throw err
    }
  }, [boardId])

  const value = {
    lists,
    loading,
    loadLists,
    createList,
    createTask,
    deleteList,
    deleteTask
  }

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>
}
