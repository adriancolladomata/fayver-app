import api from '../api/axios.js'

// Petición para la obtención de los tablones
export const getBoardsReq = async () => {
  const response = await api.get('/boards')
  return response.data
}
