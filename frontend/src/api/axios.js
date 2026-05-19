import axios from 'axios'

// Comunica axios con el puerto del backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true // Importante para el uso de cookies en sesión
})

// Interceptor para inyectar automáticamente el token Bearer en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fayver_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}, (error) => {
  // Delvue el error del rechazo de la promesa
  return Promise.reject(error)
})


export default api
