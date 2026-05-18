import axiosInstance from '../api/axios'

const API_BASE_URL = '/boards'

export const getListsReq = async (boardId) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${boardId}/lists`)
    return response.data
  } catch (error) {
    console.error('Error en getListsReq:', error.response?.data || error.message)
    throw error.response?.data || error
  }
}

export const createListReq = async (boardId, { name, color = '#ffffff' }) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/${boardId}/lists`, {
      name,
      color
    })
    return response.data
  } catch (error) {
    console.error('Error en createListReq:', error.response?.data || error.message)
    throw error.response?.data || error
  }
}

export const updateListReq = async (boardId, listId, data) => {
  try {
    const response = await axiosInstance.patch(`${API_BASE_URL}/${boardId}/lists/${listId}`, data)
    return response.data
  } catch (error) {
    console.error('Error en updateListReq:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    throw error.response?.data || error
  }
}

export const reorderListsReq = async (boardId, lists) => {
  try {
    const response = await axiosInstance.patch(
      `${API_BASE_URL}/${boardId}/lists/action/reorder`,
      lists
    )
    return response.data
  } catch (error) {
    console.error('Error en reorderListsReq:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    throw error.response?.data || error
  }
}

export const deleteListReq = async (boardId, listId) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${boardId}/lists/${listId}`)
    return response.data
  } catch (error) {
    console.error('Error en deleteListReq:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    throw error.response?.data || error
  }
}
