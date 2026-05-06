import api from '../api/axios'

// Asume que tus rutas en app.js tienen el prefijo '/auth' (ej. app.use('/auth', authRoutes))
// Si no tienen prefijo, quita '/auth' de estas rutas.

export const loginReq = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data // Devuelve los datos públicos del usuario
}

export const getMeReq = async () => {
  const response = await api.get('/auth/me')
  return response.data // Devuelve los datos del usuario si la cookie es válida
}

export const registerReq = async (name, email, password, confirmPassword) => {
  const response = await api.post('/auth/register', { name, email, password, confirmPassword })
  return response.data
}

export const logoutReq = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}
