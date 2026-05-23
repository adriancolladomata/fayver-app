import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBoards } from '../context/BoardContext'
import { useActivity } from '../context/ActivityContext'

// Recibimos las propiedades de control de la sidebar desde el Layout padre
export const NavBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user } = useAuth()
  const { currentBoard } = useBoards()
  const location = useLocation()
  const { isHistoryOpen, setIsHistoryOpen } = useActivity()

  // Extraemos las partes de la URL. Por ejemplo: "/board/123" -> ["board", "123"]
  const pathNames = location.pathname.split('/').filter((x) => x)

  const isBoardRoute = pathNames[0] === 'board' && pathNames[1]

  return (
    <nav className='bg-white h-16 flex items-center justify-between px-8 border-b border-gray-200 shadow-sm min-w-0 flex-1 shrink-0'>
      {/* IZQUIERDA: Botón Desplegable + Breadcrumbs */}
      <div className='flex items-center text-sm gap-3'>

        {/* BOTÓN APERTURA: Solo aparece si la sidebar está oculta (isSidebarOpen === false) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='mr-1 p-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 group border-none'
            title="Mostrar menú lateral"
          >
            <img
              src="../SVG Hide SideBar.svg"
              alt="Mostrar barra lateral"
              className="w-4 h-4 invert opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </button>
        )}

        {/* Siempre mostramos Fayver. Link para volver al inicio */}
        <Link to="/" className='text-gray-500 -mr-3 font-medium hover:text-blue-600 transition-colors'>
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

      {/* DERECHA: Saludo de usuario e historial de actividades */}
      <div className='flex items-center gap-5'>
        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
            isHistoryOpen
              ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-100'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
          }`}
          title="Ver historial de actividad general"
        >
          <img
            src="../SVG Stopwatch.svg" // Ojo con la ruta, asegúrate de que sea correcta en este nivel
            alt="Historial"
            className={`w-5 h-5 transition-opacity ${isHistoryOpen ? 'opacity-100' : 'opacity-70'}`}
          />
        </button>

        {/* El saludo de usuario sigue igual */}
        <div className='flex items-center gap-3 border-l border-gray-200 pl-5'>
          <p className='text-sm text-gray-600 font-medium'>
            Bienvenido de nuevo, <strong className='text-blue-600'>{user?.name || 'Usuario'}</strong>
          </p>
          <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold'>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

      </div>

    </nav>
  )
}
