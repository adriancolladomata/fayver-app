import axiosInstance from '../api/axios'

const API_BASE_URL = '/boards'

export const getListsReq = async (boardId) => {
  const response = await axiosInstance.get(`${API_BASE_URL}/${boardId}/lists`)
  return response.data
}

export const createListReq = async (boardId, { name, color = '#ffffff' }) => {
  const response = await axiosInstance.post(`${API_BASE_URL}/${boardId}/lists`, {
    name,
    color
  })
  return response.data
}

export const updateListReq = async (boardId, listId, data) => {
  const response = await axiosInstance.patch(`${API_BASE_URL}/${boardId}/lists/${listId}`, data)
  return response.data
}

export const reorderListsReq = async (boardId, lists) => {
  const response = await axiosInstance.patch(
    `${API_BASE_URL}/${boardId}/lists/action/reorder`,
    lists
  )
  return response.data
}

export const deleteListReq = async (boardId, listId) => {
  const response = await axiosInstance.delete(`${API_BASE_URL}/${boardId}/lists/${listId}`)
  return response.data
}
