import axios from 'axios'

// Comunica axios con el puerto del backend.
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true // IMPORTANTE: Permite el uso de cookies de sesión
})

export default api
