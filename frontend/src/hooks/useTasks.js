import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useLists } from '../context/ListContext'
import { createTaskReq, deleteTaskReq, updateTaskReq } from '../services/taskService'

export const useTasks = (explicitBoardId) => {
  const { boardId: paramBoardId } = useParams()
  const boardId = explicitBoardId || paramBoardId
  const { setLists, loadLists } = useLists()

  const syncLists = useCallback((updater) => {
    try {
      if (typeof setLists === 'function') {
        setLists(updater)
      } else if (typeof loadLists === 'function') {
        // If setLists not available, attempt a reload
        loadLists().catch(err => console.error('Error recargando listas:', err))
      } else {
        console.warn('ListContext no tiene setLists ni loadLists disponibles.')
      }
    } catch (e) {
      console.error('syncLists error:', e)
    }
  }, [loadLists, setLists])

  const createTask = useCallback(async (listId, name) => {
    try {
      const response = await createTaskReq(boardId, listId, { name })

      if (typeof loadLists === 'function') {
        await loadLists()
      } else {
        syncLists(prevLists => (prevLists || []).map(l =>
          l.id === listId ? { ...l, tasks: [...(l.tasks || []), { id: response.id, name: response.name }] } : l
        ))
      }

      return response
    } catch (err) {
      console.error('Error al crear tarea:', err)
      throw err
    }
  }, [boardId, loadLists, syncLists])

  const deleteTask = useCallback(async (listId, taskId) => {
    try {
      await deleteTaskReq(boardId, listId, taskId)
      syncLists(prevLists => (prevLists || []).map(l =>
        l.id === listId ? { ...l, tasks: (l.tasks || []).filter(t => t.id !== taskId) } : l
      ))
    } catch (err) {
      console.error('Error al eliminar tarea:', err)
      throw err
    }
  }, [boardId, syncLists])

  const updateTask = useCallback(async (listId, taskId, fieldsToUpdate) => {
    try {
      await updateTaskReq(boardId, listId, taskId, fieldsToUpdate)

      const shouldReload = fieldsToUpdate && Object.prototype.hasOwnProperty.call(fieldsToUpdate, 'order')

      if (shouldReload) {
        if (typeof loadLists === 'function') {
          await loadLists()
        } else {
          // fallback: update local order and sort
          syncLists(prevLists => (prevLists || []).map(l =>
            l.id === listId
              ? { ...l, tasks: (l.tasks || []).map(t => t.id === taskId ? { ...t, ...fieldsToUpdate } : t).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) }
              : l
          ))
        }
      } else {
        syncLists(prevLists => (prevLists || []).map(l =>
          l.id === listId ? { ...l, tasks: (l.tasks || []).map(t => t.id === taskId ? { ...t, ...fieldsToUpdate } : t) } : l
        ))
      }
    } catch (err) {
      console.error('Error al actualizar tarea:', err)
      throw err
    }
  }, [boardId, loadLists, syncLists])

  return {
    createTask,
    deleteTask,
    updateTask
  }

}
