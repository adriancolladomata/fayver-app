import api from '../api/axios.js'

// Petición para la obtención de los tablones
export const getBoardsReq = async () => {
  const response = await api.get('/boards')
  return response.data
}

// Petición para obtener un tablón específico
export const getBoardReq = async (boardId) => {
  const response = await api.get(`/boards/${boardId}`)
  return response.data
}

// Petición para crear un nuevo tablón
export const createBoardReq = async (boardData) => {
  const response = await api.post('/boards', boardData)
  return response.data
}

// Petición para eliminar/archivar un tablón
export const deleteBoardReq = async (boardId) => {
  const response = await api.get(`/boards(${boardId})`)
  return response
}
