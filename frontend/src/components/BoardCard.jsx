import { useNavigate } from 'react-router-dom'

export const BoardCard = ({ board }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className='bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer border-blue-500 overflow-hidden group'
    >
      {/* Div de fondo pegado arriba, izquierda y derecha */}
      <div className='bg-sky-400 h-24 w-full'></div>

      {/* Contenedor del texto con su propio padding */}
      <div className='p-4'>
        <h6 className='text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors'>
          {board.name}
        </h6>
        {/* Podrías añadir aquí la descripción si quieres */}
      </div>
    </div>
  )
}
