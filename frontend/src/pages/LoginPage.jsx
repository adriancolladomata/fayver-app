import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FayverFlowLogo } from '../assets/fayver'
import { useToast } from '../context/ToastContext'

export const LoginPage = () => {
  // Hook para navegar entre rutas
  const navigate = useNavigate()
  // Guardamos lo que el usuario escribe en los inputs en tiempo real
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, user } = useAuth()
  const { showToast } = useToast()

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
      showToast('Has iniciado sesión en Fayver', 'success')
      // El useEffect se encargará de la redirección cuando user se actualice
    } catch (error) {
      console.log('ERROR DETALLADO: ', error.response?.data)
      const backendError = error.response?.data

      if (backendError?.error) {
        // Mapeado directo de Zod
        const zodMessages = Object.values(backendError.error).flat().join(' ')
        showToast(zodMessages, 'error')
      } else {
        // Si las credenciales no coinciden en la base de datos ("Contraseña incorrecta", etc.)
        showToast(backendError?.message || 'Error al entrar', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-neutral-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        {/* Header con Branding */}
        <div className='mb-10 text-center flex flex-col items-center'>
          <FayverFlowLogo className='w-20 h-20 mb-4 drop-shadow-sm' />
          <h1 className='text-4xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent mb-2'>
          Fayver
          </h1>
          <p className='text-neutral-500 text-sm font-medium uppercase tracking-widest'>
          Visualiza. Fluye. Logra.
          </p>
        </div>

        {/* Card del Formulario */}
        <div className='bg-white p-8 rounded-2xl shadow-sm border border-neutral-200/60'>
          <div className='mb-6'>
            <h2 className='text-xl font-bold text-neutral-800'>Bienvenido de nuevo</h2>
            <p className='text-neutral-500 text-sm'>Ingresa tus credenciales para acceder</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 ml-1'>Email</label>
              <input
                type='email'
                placeholder='tu@ejemplo.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all'
              />
            </div>

            <div>
              <label className='block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 ml-1'>Contraseña</label>
              <input
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all'
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full mt-2 bg-gradient-to-r from-blue-700 to-blue-500 hover:brightness-110 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]'
            >
              {isLoading ? 'Conectando...' : 'Entrar en Fayver'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className='text-center mt-8 text-neutral-500 text-sm'>
        ¿Nuevo en la plataforma?{' '}
          <button
            onClick={() => navigate('/register')}
            className='text-blue-600 hover:text-blue-700 font-bold transition-colors underline-offset-4 hover:underline'
          >
          Crea una cuenta gratuita
          </button>
        </p>
      </div>
    </div>
  )
}
