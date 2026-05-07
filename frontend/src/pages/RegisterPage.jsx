import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const RegisterPage = () => {
  // Hook para navegar entre rutas
  const navigate = useNavigate()
  // Guardamos lo que el usuario escribe en los inputs en tiempo real
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    // Evita que la página se recargue
    e.preventDefault()
    setIsLoading(true)
    try {
      // Esta función viene de AuthContext. Si el registro sale bien, envia un alert específico
      await register(name, email, password, confirmPassword)
      alert('Te has registrado correctamente en Fayver')
      // Redirige al login después del registro exitoso
      navigate('/login')
    } catch (error) {
      // Si el registro sale mal, envia un console.log con el error y un alert
      console.log('ERROR DETALLADO: ', error.response?.data)
      alert(error.response?.data?.message || 'Error al registrarse')
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
          <p className='text-gray-500 text-base'>Crea tu cuenta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name Input */}
          <div>
            <input
              type='text'
              placeholder='Nombre completo'
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all'
            />
          </div>

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

          {/* Confirm Password Input */}
          <div>
            <input
              type='password'
              placeholder='Confirmar contraseña'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Registrándose...' : 'Crear cuenta'}
          </button>
        </form>

        {/* Divider */}
        <div className='relative my-8'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-200'></div>
          </div>
        </div>

        {/* Login Link */}
        <p className='text-center text-gray-600 text-sm'>
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={() => navigate('/login')}
            className='text-blue-600 hover:text-blue-700 font-semibold transition-colors'
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  )
}
