import axiosInstance from '../api/axios'

// Base de la API para los endpoints de tableros
const API_BASE_URL = '/boards'

export const getTasksReq = async (boardId, listId) => {
  // Pide al backend las tareas de una lista
  const response = await axiosInstance.get(
    `${API_BASE_URL}/${boardId}/lists/${listId}/tasks`
  )
  return response.data
}

export const createTaskReq = async (boardId, listId, { name }) => {
  // Crea una tarea nueva en la lista indicada
  const response = await axiosInstance.post(
    `${API_BASE_URL}/${boardId}/lists/${listId}/tasks`,
    { name }
  )
  return response.data
}

export const deleteTaskReq = async (boardId, listId, taskId) => {
  // Borra una tarea concreta del backend
  const response = await axiosInstance.delete(
    `${API_BASE_URL}/${boardId}/lists/${listId}/tasks/${taskId}`
  )
  return response.data
}

export const updateTaskReq = async (boardId, listId, taskId, data) => {
  // Envía los cambios de una tarea al backend
  const response = await axiosInstance.patch(
    `${API_BASE_URL}/${boardId}/lists/${listId}/tasks/${taskId}`,
    data
  )
  return response.data
}

export const updateTasksOrderReq = async (boardId, listId, tasksArray) => {
  // Reordena las tareas en una lista
  const response = await axiosInstance.patch(
    `${API_BASE_URL}/${boardId}/lists/${listId}/tasks/action/reorder`,
    tasksArray
  )
  return response.data
}
