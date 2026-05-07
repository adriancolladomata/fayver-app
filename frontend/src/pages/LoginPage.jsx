import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const LoginPage = () => {
  // Hook para navegar entre rutas
  const navigate = useNavigate()
  // Guardamos lo que el usuario escribe en los inputs en tiempo real
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, user } = useAuth()

  // Cuando el usuario se actualiza (después del login), redirigir al dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    // Evita que la página se recargue.
    e.preventDefault()
    setIsLoading(true)
    try {
      // Esta función viene de AuthContext. Si el login sale bien, actualiza el estado user.
      await login(email, password)
      alert('Has iniciado sesión en Fayver')
      // El useEffect se encargará de la redirección cuando user se actualice
    } catch (error) {
      // Si el login sale mal. Envia un console.log con el error y un alert.
      console.log('ERROR DETALLADO: ', error.response?.data)
      alert(error.response?.data?.message || 'Error al entrar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-white flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Fayver</h1>
          <p className='text-gray-500 text-base'>Inicia sesión en tu cuenta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Email Input */}
          <div>
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all'
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type='password'
              placeholder='Contraseña'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all'
            />
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors duration-200'
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Divider */}
        <div className='relative my-8'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-200'></div>
          </div>
        </div>

        {/* Register Link */}
        <p className='text-center text-gray-600 text-sm'>
          ¿No tienes cuenta?{' '}
          <button
            onClick={() => navigate('/register')}
            className='text-blue-600 hover:text-blue-700 font-semibold transition-colors'
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  )
}
