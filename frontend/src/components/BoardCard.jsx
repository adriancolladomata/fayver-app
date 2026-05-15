import { useNavigate } from 'react-router-dom'

// Card del tablón, el cual se muestra en el DashboardPage
export const BoardCard = ({ board, onOpenSettings }) => {
  // Instancia de useNavigate para redirigir al hacer click en la card
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className='bg-neutral-800 rounded-lg shadow-md hover:shadow-xl/20 transition-shadow cursor-pointer border-blue-500 overflow-hidden group'
    >
      {/* Div de fondo pegado arriba, izquierda y derecha */}
      <div className='bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 h-24 w-full flex justify-end items-start p-3'>
        <button
          type='button'
          onClick={(event) => {
            event.stopPropagation()
            onOpenSettings?.(board)
          }}
          className='w-10 h-10 text-gray-100 hover:text-white transition-colors cursor-pointer flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20'
          title='Configurar tablón'
        >
          <img src='../SVGDotsVertical.svg' alt='Icono tres puntos' className='w-5 h-5' />
        </button>
      </div>

      {/* Contenedor del texto con su propio padding */}
      <div className='p-4'>
        <h6 className='text-lg font-bold text-neutral-100 transition-colors'>
          {board.name}
        </h6>
      </div>
    </div>
  )
}
