import { useNavigate } from 'react-router-dom'

export const BoardCard = ({ board }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className='bg-neutral-800 rounded-lg shadow-md hover:shadow-xl/20 transition-shadow cursor-pointer border-blue-500 overflow-hidden group'
    >
      {/* Div de fondo pegado arriba, izquierda y derecha */}
      <div className='bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 h-24 w-full'></div>

      {/* Contenedor del texto con su propio padding */}
      <div className='p-4'>
        <h6 className='text-lg font-bold text-neutral-100 transition-colors'>
          {board.name}
        </h6>
        {/* Podrías añadir aquí la descripción si quieres */}
      </div>
    </div>
  )
}
