import axios from 'axios'

// Comunica axios con el puerto del backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true // Importante para el uso de cookies en sesión
})

export default api
