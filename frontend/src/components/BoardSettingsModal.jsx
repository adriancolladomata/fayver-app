import { useEffect, useState } from 'react'
import { useConfirmation } from '../context/ConfirmationContext'

export const BoardSettingsModal = ({ isOpen, onClose, board, onUpdate, onDelete, loading }) => {
  const [newName, setNewName] = useState(board?.name || '')
  const { requireConfirm } = useConfirmation()

  //Esto asegura que el input siempre muestre el nombre del tablón seleccionado
  useEffect(() => {
    if (board) {
      setNewName(board.name)
    }
  }, [board])

  if (!isOpen) return null // Si el modal no está abierto, no renderiza nada

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(newName)
  }

  // Manejador asíncrono
  const handleDeleteClick = async () => {
    const hasConfirmed = await requireConfirm(
      '¿Eliminar este tablón?',
      `Esta acción eliminará de forma permanente el tablón "${board?.name}" junto con todas sus listas y tarjetas asociadas.`
    )

    if (hasConfirmed) {
      onDelete(board.id)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
      {/* Contenedor del Modal */}
      <div className='bg-white w-full max-w-md rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-200'>

        {/* Cabecera Azul (Estilo Fayver) */}
        <div className='bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white'>
          <h2 className='text-xl font-bold'>Configuración del tablón</h2>
          <p className='text-blue-100 text-sm'>Modifica los detalles o elimina el proyecto</p>
        </div>

        <div className='p-6'>
          {/* Sección: Cambiar Nombre */}
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>
                Nombre del tablón
              </label>
              <input
                autoFocus
                type='text'
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder='Nombre del tablón'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800'
              />
            </div>

            <div className='flex justify-end gap-3 mt-6 border-b pb-6'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={loading || newName === board?.name}
                className='px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold rounded-lg hover:opacity-90 cursor-pointer transition-colors disabled:opacity-50'
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>

          {/* Sección: Zona de Peligro (Eliminar) */}
          <div className='mt-6'>
            <div className='flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100'>
              <span className='text-xs text-red-700'>Esta acción eliminará el tablón y todas sus listas.</span>
              <button
                type='button'
                onClick={handleDeleteClick}
                className='px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors cursor-pointer'
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
