import { useState, useCallback } from 'react'
import { BoardCard } from '../components/BoardCard.jsx'
import { useBoards } from '../context/BoardContext.jsx'
import { BoardSettingsModal } from '../components/BoardSettingsModal.jsx'

export const DashboardPage = () => {
  const [boardToEdit, setBoardToEdit] = useState(null)
  const [isProcessing, setIsProcessing] = useState(null)
  const { boards, loading, updateBoard, deleteBoard } = useBoards()

  const handleOpenSettings = useCallback((board) => {
    setBoardToEdit(board)
  }, [])

  const handleCloseSettings = useCallback(() => {
    setBoardToEdit(null)
  }, [])

  const handleUpdateBoard = useCallback(async (newName) => {
    if (!boardToEdit) return
    try {
      setIsProcessing(true)
      // Ejecuta la petición HTTP y actualiza el estado global de boards
      await updateBoard(boardToEdit.id, newName)
      handleCloseSettings() // Solo se cierra si la petición fue exitosa
    } catch (error) {
      alert('Hubo un error al actualizar el nombre del tablón.')
    } finally {
      setIsProcessing(false)
    }
  }, [boardToEdit, updateBoard, handleCloseSettings])

  const handleDeleteBoard = useCallback(async (id) => {
    try {
      setIsProcessing(true)
      // Ejecuta el Soft-Delete en el backend y lo quita del estado local
      await deleteBoard(id)
      handleCloseSettings()
    } catch (error) {
      alert('Hubo un error al eliminar el tablón.')
    } finally {
      setIsProcessing(false)
    }
  }, [deleteBoard, handleCloseSettings])

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
            <BoardCard
              key={board.id}
              board={board}
              onOpenSettings={handleOpenSettings}
            />
          ))
        ) : (
          <p className='text-gray-400 col-span-full text-center py-20 border-2 border-dashed rounded-xl'>
            Aún no tienes tablones. ¡Crea el primero!
          </p>
        )}
      </div>

      <BoardSettingsModal
        isOpen={!!boardToEdit}
        onClose={handleCloseSettings}
        board={boardToEdit}
        onUpdate={handleUpdateBoard}
        onDelete={handleDeleteBoard}
        loading={isProcessing}
      />
    </div>
  )
}
