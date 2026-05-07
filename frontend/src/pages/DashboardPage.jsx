import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getBoardsReq } from '../services/boardService.js'
import { BoardCard } from '../components/BoardCard.jsx'

export const DashboardPage = () => {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const res = await getBoardsReq()
        setBoards(res)
      } catch (error) {
        console.error('Error al cargar los tablones: ', error)
      } finally {
        setLoading(false)
      }
    }

    loadBoards()
  }, [])

  if (loading) return <p className='p-10 text-center'>Cargando tus proyectos....</p>

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Mis tablones</h1>
          <p className='text-gray-500'>Gestiona tus flujos de trabajo</p>
        </div>
        <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          + Nuevo Tablón
        </button>
      </div>
      {/* Grid de Tablones */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {boards.length > 0 ? (
          boards.map(board => (
            <BoardCard key={board.id} board={board} />
          ))
        ) : (
          <p className='text-gray-400 col-span-full text-center py-20 border-2 border-dashed rounded-xl'>
            Aún no tienes tablones. ¡Crea el primero!
          </p>
        )}
      </div>
    </div>
  )
}
