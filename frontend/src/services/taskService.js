import axiosInstance from '../api/axios'

const API_BASE_URL = '/boards'

export const getTasksReq = async (boardId, listId) => {
  const response = await axiosInstance.get(
    `${API_BASE_URL}/${boardId}/lists/${listId}/tasks`
  )
  return response.data
}

export const createTaskReq = async (boardId, listId, { name }) => {
  const response = await axiosInstance.post(
    `${API_BASE_URL}/${boardId}/lists/${listId}/tasks`,
    { name }
  )
  return response.data
}

export const deleteTaskReq = async (boardId, listId, taskId) => {
  const response = await axiosInstance.delete(
    `${API_BASE_URL}/${boardId}/lists/${listId}/tasks/${taskId}`
  )
  return response.data
}
