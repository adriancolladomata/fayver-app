import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBoards } from '../context/BoardContext'

export const NavBar = () => {
  const { user } = useAuth()
  const { currentBoard } = useBoards()
  const location = useLocation()

  // Extraemos las partes de la URL. Por ejemplo: "/board/123" -> ["board", "123"]
  const pathNames = location.pathname.split('/').filter((x) => x)

  const isBoardRoute = pathNames[0] === 'board' && pathNames[1]

  return (
    <nav className='bg-white h-16 flex items-center justify-between px-8 border-b border-gray-200 shadow-sm w-full'>

      {/* IZQUIERDA: Breadcrumbs */}
      <div className='flex items-center text-sm'>
        {/* Siempre mostramos Fayver. Link para volver al inicio */}
        <Link to="/" className='text-gray-500 font-medium hover:text-blue-600 transition-colors'>
          Fayver
        </Link>

        {/* Lógica condicional para el tablón */}
        {isBoardRoute && (
          <div className='flex items-center'>
            <span className='mx-2 text-gray-400'>/</span>
            <span className='text-blue-600 font-semibold capitalize'>
              {/* Si tenemos el nombre en el context lo mostramos, si no, un loading o el ID acortado */}
              {currentBoard ? currentBoard.name : 'Cargando tablón...'}
            </span>
          </div>
        )}

        {/* Si hay más rutas después del tablero (ej. configuraciones), podrías mapearlas aquí */}
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
