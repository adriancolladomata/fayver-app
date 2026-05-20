import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FayverFlowLogo } from '../assets/fayver'
import { useToast } from '../context/ToastContext'

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
  const { showToast } = useToast()

  const handleSubmit = async (e) => {
    // Evita que la página se recargue
    e.preventDefault()
    setIsLoading(true)
    try {
      // Esta función viene de AuthContext. Si el registro sale bien, envia un alert específico
      await register(name, email, password, confirmPassword)
      showToast('Te has registrado correctamente en Fayver', 'success')
      // Redirige al login después del registro exitoso
      navigate('/login')
    } catch (error) {
      console.log('ERROR DETALLADO: ', error.response?.data)
      const backendError = error.response?.data

      if (backendError?.error) {
        // Mapeado directo de Zod
        // Extraemos solo los mensajes de error del array de Zod y los unimos con espacios
        const zodMessages = Object.values(backendError.error).flat().join(' • ')
        showToast(zodMessages, 'error')
      } else {
        // Si es un error manual de la base de datos (Ej: "El usuario ya está registrado")
        showToast(backendError?.message || 'Error al registrarse', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-neutral-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        {/* Header con Branding (Igual al Login) */}
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
            <h2 className='text-xl font-bold text-neutral-800'>Crear cuenta</h2>
            <p className='text-neutral-500 text-sm'>Únete al mejor gestor de tareas</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Nombre completo */}
            <div>
              <label className='block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 ml-1'>Nombre completo</label>
              <input
                type='text'
                placeholder='Tu nombre'
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className='w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all'
              />
            </div>

            {/* Email */}
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

            {/* Contraseña */}
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
              <p className='mt-1.5 ml-1 text-[11px] text-neutral-400 font-medium leading-normal'>
                Mínimo 8 caracteres con al menos una mayúscula, una minúscula y un carácter especial (@, $, !, %, *).
              </p>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className='block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 ml-1'>Confirmar contraseña</label>
              <input
                type='password'
                placeholder='••••••••'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className='w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all'
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full mt-2 bg-gradient-to-r from-blue-700 to-blue-500 hover:brightness-110 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]'
            >
              {isLoading ? 'Registrando...' : 'Crear mi cuenta'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className='text-center mt-8 text-neutral-500 text-sm'>
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={() => navigate('/login')}
            className='text-blue-600 hover:text-blue-700 font-bold transition-colors underline-offset-4 hover:underline'
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  )
}
