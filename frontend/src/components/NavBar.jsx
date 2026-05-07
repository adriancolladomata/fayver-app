import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const NavBar = () => {
  const { user } = useAuth()
  const location = useLocation()

  // Extraemos las partes de la URL. Por ejemplo: "/board/123" -> ["board", "123"]
  const pathNames = location.pathname.split('/').filter((x) => x)

  return (
    <nav className='bg-white h-16 flex items-center justify-between px-8 border-b border-gray-200 shadow-sm w-full'>

      {/* IZQUIERDA: Breadcrumbs (Migas de pan) */}
      <div className='flex items-center text-sm'>
        <span className='text-gray-500 font-medium'>Fayver</span>

        {pathNames.map((value, index) => {
          const isLast = index === pathNames.length - 1

          return (
            <div key={value} className='flex items-center'>
              <span className='mx-2 text-gray-400'>/</span>
              <span
                className={`capitalize ${isLast ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
              >
                {/* Si la ruta es muy larga (ej. un ID de mongo), la acortamos visualmente */}
                {value.length > 15 ? `${value.substring(0, 8)}...` : value}
              </span>
            </div>
          )
        })}
      </div>

      {/* DERECHA: Saludo de usuario */}
      <div className='flex items-center gap-3'>
        <p className='text-sm text-gray-600 font-medium'>
          Bienvenido de nuevo, <strong className='text-blue-600'>{user?.name || 'Usuario'}</strong>
        </p>
        {/* Avatar opcional (un círculo con la inicial) */}
        <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold'>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>

    </nav>
  )
}
