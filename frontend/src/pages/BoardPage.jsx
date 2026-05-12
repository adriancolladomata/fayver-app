import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ListColumn } from '../components/ListColumn'
import { CreateListModal } from '../components/CreateListModal'
import { ListProvider, useLists } from '../context/ListContext'
import { useBoards } from '../context/BoardContext'

const BoardPageContent = () => {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const [showListModal, setShowListModal] = useState(false)
  const { lists, loading, loadLists } = useLists()
  const { boards, setCurrentBoard } = useBoards()

  useEffect(() => {
    // Buscamos el objeto del tablón actual dentro del array global de boards
    const current = boards.find(b => b.id === boardId)
    // Si hay tablon actual, se lo asignamos a currentBoard en BoardContext
    if (current) {
      setCurrentBoard(current)
    }

    // Si salimos del tablón, gracias a useEffect, asignamos que el tablón actual es null
    return () => setCurrentBoard(null)
  })

  useEffect(() => {
    loadLists()
  }, [loadLists])

  if (loading) {
    return <p className='p-10 text-center text-gray-600'>Cargando tablón...</p>
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mb-8 flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>Tablón</h1>
          <p className='text-gray-600 mt-2'>{lists.length} lista(s)</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
        >
          ← Volver
        </button>
      </div>

      <div className='overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300'>
        <div className='flex gap-6 min-w-min'>
          {lists.map(list => (
            <ListColumn key={list.id} list={list} boardId={boardId} />
          ))}

          <div className='flex-shrink-0 w-80'>
            <button
              onClick={() => setShowListModal(true)}
              className='w-full h-full min-h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center bg-white'
            >
              <div className='text-center'>
                <p className='text-4xl text-gray-400 mb-2'>+</p>
                <p className='text-gray-600'>Nueva lista</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <CreateListModal
        isOpen={showListModal}
        onClose={() => setShowListModal(false)}
      />
    </div>
  )
}

export const BoardPage = () => {
  const { boardId } = useParams()

  if (!boardId) {
    return (
      <div className='p-10 text-center'>
        <p className='text-red-600'>Tablón no encontrado</p>
      </div>
    )
  }

  return (
    <ListProvider boardId={boardId}>
      <BoardPageContent />
    </ListProvider>
  )
}
