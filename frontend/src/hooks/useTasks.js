import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useLists } from '../context/ListContext'
import { createTaskReq, deleteTaskReq, updateTaskReq } from '../services/taskService'

// Hook que gestiona todas las operaciones con tareas: crear, borrar y editar
export const useTasks = (explicitBoardId) => {
  // Obtiene el id del tablero desde la URL o lo recibe como parámetro
  const { boardId: paramBoardId } = useParams()
  const boardId = explicitBoardId || paramBoardId

  // Obtiene funciones para actualizar y recargar la lista de listas desde el contexto
  const { setLists, loadLists } = useLists()

  // Función auxiliar que sincroniza el estado de las listas
  // Actualiza lo que ves en pantalla después de cualquier cambio
  const syncLists = useCallback((updater) => {
    try {
      if (typeof setLists === 'function') {
        // Si existe setLists, lo usa para actualizar el estado
        setLists(updater)
      } else if (typeof loadLists === 'function') {
        // Si no existe, recarga todas las listas desde el servidor
        loadLists().catch(err => console.error('Error recargando listas:', err))
      } else {
        console.warn('ListContext no tiene setLists ni loadLists disponibles.')
      }
    } catch (e) {
      console.error('syncLists error:', e)
    }
  }, [loadLists, setLists])

  // Crea una nueva tarea en una lista específica
  const createTask = useCallback(async (listId, name) => {
    try {
      // Envía la petición al backend para crear la tarea
      const response = await createTaskReq(boardId, listId, { name })

      if (typeof loadLists === 'function') {
        // Si está disponible, recarga todas las listas
        await loadLists()
      } else {
        // Si no, actualiza solo la lista donde se creó la tarea
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

  // Borra una tarea de una lista
  const deleteTask = useCallback(async (listId, taskId) => {
    try {
      // Envía la petición al backend para borrar la tarea
      await deleteTaskReq(boardId, listId, taskId)

      // Actualiza el estado quitando la tarea de la pantalla
      syncLists(prevLists => (prevLists || []).map(l =>
        l.id === listId ? { ...l, tasks: (l.tasks || []).filter(t => t.id !== taskId) } : l
      ))
    } catch (err) {
      console.error('Error al eliminar tarea:', err)
      throw err
    }
  }, [boardId, syncLists])

  // Edita una tarea (cambiar nombre, estado, orden, color, etc)
  const updateTask = useCallback(async (listId, taskId, fieldsToUpdate) => {
    try {
      // Envía la petición al backend con los cambios
      await updateTaskReq(boardId, listId, taskId, fieldsToUpdate)

      // Verifica si se cambió el orden (para saber si necesita reordenar)
      const shouldReload = fieldsToUpdate && Object.prototype.hasOwnProperty.call(fieldsToUpdate, 'order')

      if (shouldReload) {
        // Si cambió el orden, recarga todas las tareas para ordenarlas correctamente
        if (typeof loadLists === 'function') {
          await loadLists()
        } else {
          syncLists(prevLists => (prevLists || []).map(l =>
            l.id === listId
              ? { ...l, tasks: (l.tasks || []).map(t => t.id === taskId ? { ...t, ...fieldsToUpdate } : t).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) }
              : l
          ))
        }
      } else {
        // Si solo cambió texto o color, actualiza sin recargar
        syncLists(prevLists => (prevLists || []).map(l =>
          l.id === listId ? { ...l, tasks: (l.tasks || []).map(t => t.id === taskId ? { ...t, ...fieldsToUpdate } : t) } : l
        ))
      }
    } catch (err) {
      console.error('Error al actualizar tarea:', err)
      throw err
    }
  }, [boardId, loadLists, syncLists])

  // Devuelve las tres funciones para que los componentes las usen
  return {
    createTask,
    deleteTask,
    updateTask
  }

}
