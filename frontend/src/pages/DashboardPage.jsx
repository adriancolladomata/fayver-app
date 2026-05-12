import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getBoardsReq } from '../services/boardService.js'
import { BoardCard } from '../components/BoardCard.jsx'
import { useBoards } from '../context/BoardContext.jsx'
import { BoardSettingsModal } from '../components/BoardSettingsModal.jsx'

export const DashboardPage = () => {
  const [isBoardSettingsModalOpen, setIsBoardSettingsModalOpen] = useState(false)
  const [boardToEdit, setBoardToEdit] = useState(null)
  const { boards, loading, updateBoard, deleteBoard } = useBoards()

  // Función para abrir el modal (Se la pasaremos a la card)
  const handleOpenSettings = useCallback((board) => {
    setBoardToEdit(board) // Guardamos cual es el tablón escogido
    setIsBoardSettingsModalOpen(true) // Abrimos el modal
  }, [])

  // Función para actualizar el tablón seleccionado
  const handleUpdateBoard = useCallback(async (newName) => {
    try {
      await updateBoard(boardToEdit.id, newName)
      setIsBoardSettingsModalOpen(false) // Cerramos al terminar
    } catch (error) {
      console.error('Error actualizando: ', error)
    }
  }, [])

  // Función para eliminar el tablón seleccionado
  const handleDeleteBoard = useCallback(async (boardId) => {
    try {
      await deleteBoard(boardToEdit.id)
    } catch (error) {
      console.log('Error eliminando: ', error)
    }
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
