import { useState, useEffect } from 'react'
import { useLists } from '../context/ListContext'
import { useToast } from '../context/ToastContext'
import { getActivityMessage } from '../utils/activityLogs'

export const ListSettingsModal = ({ isOpen, onClose, list, boardId, allLists }) => {
  const [currentTab, setCurrentTab] = useState('main') // main, rename, move, color, delete
  const [newName, setNewName] = useState(list?.name || '')
  const [selectedColor, setSelectedColor] = useState(list?.color || '#ffffff')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const { updateList, reorderLists, deleteList, logActivity } = useLists()
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen && list) {
      setNewName(list.name || '')
      setSelectedColor(list.color || '#ffffff')
    }
  }, [isOpen, list])

  const colors = [
    '#ffffff',
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#ffd93d',
    '#6bcf7f',
    '#a78bfa'
  ]

  const handleRename = async () => {
    if (!newName.trim()) {
      setMessage({ type: 'error', text: 'El nombre de la lista no puede estar vacío' })
      return
    }

    if (newName.trim() === list?.name) {
      setMessage({ type: 'error', text: 'El nuevo nombre es igual al actual' })
      return
    }

    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      console.log('Intentando actualizar nombre:', { boardId, listId: list.id, newName: newName.trim() })
      await updateList(list.id, { name: newName.trim() })
      logActivity(getActivityMessage('LIST_UPDATE_NAME', { name: newName.trim() }))
      setMessage({ type: 'success', text: 'Nombre actualizado correctamente' })
      setTimeout(() => {
        setCurrentTab('main')
        setNewName(list?.name || '')
        setMessage({ type: '', text: '' })
      }, 1500)
    } catch (error) {
      console.error('Error al actualizar nombre:', error)
      const errorMsg = error?.message || error?.error?.message || 'No se pudo actualizar el nombre de la lista'
      setMessage({ type: 'error', text: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateColor = async () => {
    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      await updateList(list.id, { color: selectedColor })
      logActivity(getActivityMessage('LIST_UPDATE_COLOR', { color: selectedColor }))
      setMessage({ type: 'success', text: 'Color actualizado correctamente' })
      setTimeout(() => {
        setCurrentTab('main')
        setMessage({ type: '', text: '' })
      }, 1500)
    } catch (error) {
      console.error('Error al actualizar color:', error)
      setMessage({ type: 'error', text: 'No se pudo actualizar el color de la lista' })
    } finally {
      setLoading(false)
    }
  }

  const handleMoveList = async (newPosition) => {
    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      const listsCopy = [...allLists]
      const currentIndex = listsCopy.findIndex(l => l.id === list.id)

      if (currentIndex !== -1) {
        const [movedList] = listsCopy.splice(currentIndex, 1)
        listsCopy.splice(newPosition, 0, movedList)

        const reorderData = listsCopy.map((l, index) => ({
          id: l.id,
          order: index
        }))

        await reorderLists(reorderData)
        logActivity(getActivityMessage('LIST_REORDER'))
        setMessage({ type: 'success', text: 'Lista movida correctamente' })
        setTimeout(() => {
          setCurrentTab('main')
          setMessage({ type: '', text: '' })
        }, 1500)
      }
    } catch (error) {
      console.error('Error al mover lista:', error)
      setMessage({ type: 'error', text: 'No se pudo mover la lista' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteList = async () => {
    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      await deleteList(list.id)
      logActivity(getActivityMessage('LIST_DELETE', {name: list.name}))
      setMessage({ type: 'success', text: 'La lista ha sido eliminada correctamente' })
      setTimeout(() => {
        onClose()
        setCurrentTab('main')
        setMessage({ type: '', text: '' })
      }, 1500)
    } catch (error) {
      console.error('Error al eliminar lista:', error)
      setMessage({ type: 'error', text: 'No se pudo eliminar la lista' })
    } finally {
      setLoading(false)
    }
  }

  const handleArchiveList = async () => {
    try {
      setLoading(true)
      await updateList(list.id, { is_archived: true })
      logActivity(getActivityMessage('LIST_ARCHIVE', {name: list.name}))
      showToast('Lista archivada correctamente', 'success') // Si tienes acceso a showToast
      onClose()
    } catch (error) {
      console.error('Error al archivar lista:', error)
      setMessage({ type: 'error', text: 'No se pudo archivar la lista' })
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setCurrentTab('main')
    setNewName(list?.name || '')
    setSelectedColor(list?.color || '#ffffff')
    setMessage({ type: '', text: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
      <div className='bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>

        {/* Main Settings Tab */}
        {currentTab === 'main' && (
          <>
            <div className='bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white'>
              <h2 className='text-xl font-bold'>Configuración de Lista</h2>
              <p className='text-blue-100 text-sm'>Gestiona los parámetros de "{list?.name}"</p>
            </div>
            <div className='p-6 space-y-3'>
              <button
                onClick={() => setCurrentTab('rename')}
                className='w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-gray-800 flex items-center gap-3 cursor-pointer'
                disabled={loading}
              >
                <span>Cambiar nombre</span>
              </button>

              <button
                onClick={() => setCurrentTab('move')}
                className='w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-gray-800 flex items-center gap-3 cursor-pointer'
                disabled={loading}
              >
                <span>Mover lista</span>
              </button>

              <button
                onClick={() => setCurrentTab('color')}
                className='w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-gray-800 flex items-center gap-3 cursor-pointer'
                disabled={loading}
              >
                <span>Cambiar color</span>
              </button>

              <button
                onClick={handleArchiveList}
                className='w-full text-left px-4 py-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors font-medium text-amber-700 flex items-center gap-3 cursor-pointer'
                disabled={loading}
              >
                <span>Archivar lista</span>
              </button>

              <button
                onClick={() => setCurrentTab('delete')}
                className='w-full text-left px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors font-medium text-red-700 flex items-center gap-3 cursor-pointer'
                disabled={loading}
              >
                <span>Eliminar lista</span>
              </button>
            </div>

            <div className='p-6 border-t border-gray-200 flex justify-end'>
              <button
                onClick={closeModal}
                className='px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors'
                disabled={loading}
              >
                Cerrar
              </button>
            </div>
          </>
        )}

        {/* Rename Tab */}
        {currentTab === 'rename' && (
          <>
            <div className='bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white'>
              <h2 className='text-xl font-bold'>Cambiar nombre</h2>
              <p className='text-blue-100 text-sm'>Ingresa el nuevo nombre para la lista</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleRename() }} className='p-6'>
              <input
                type='text'
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder='Nuevo nombre'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800 mb-4'
                autoFocus
                disabled={loading}
              />

              {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <div className='flex justify-end gap-3 mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setCurrentTab('main')
                    setNewName(list?.name || '')
                    setMessage({ type: '', text: '' })
                  }}
                  className='px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors'
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type='submit'
                  className='px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50'
                  disabled={loading || newName.trim() === list?.name}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Move Tab */}
        {currentTab === 'move' && (
          <>
            <div className='bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white'>
              <h2 className='text-xl font-bold'>Mover lista</h2>
              <p className='text-blue-100 text-sm'>Selecciona la nueva posición</p>
            </div>
            <div className='p-6'>
              <div className='space-y-2 max-h-72 overflow-y-auto mb-4'>
                {allLists.map((l, index) => (
                  <button
                    key={l.id}
                    onClick={() => handleMoveList(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer font-medium ${
                      l.id === list.id
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                    }`}
                    disabled={loading}
                  >
                    <span className='text-sm'>Posición {index + 1}</span>
                    <span className='text-sm text-gray-600 ml-2'>• {l.name}</span>
                  </button>
                ))}
              </div>

              {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <div className='flex justify-end gap-3 mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setCurrentTab('main')
                    setMessage({ type: '', text: '' })
                  }}
                  className='px-4 py-2 text-gray-600 hover:bg-gray-200 cursor-pointer rounded-lg transition-colors'
                  disabled={loading}
                >
                  Atrás
                </button>
              </div>
            </div>
          </>
        )}

        {/* Color Tab */}
        {currentTab === 'color' && (
          <>
            <div className='bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white'>
              <h2 className='text-xl font-bold'>Cambiar color</h2>
              <p className='text-blue-100 text-sm'>Selecciona un color para la lista</p>
            </div>
            <div className='p-6'>
              <div className='flex gap-3 flex-wrap mb-4'>
                {colors.map(c => (
                  <button
                    key={c}
                    type='button'
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === c ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: c }}
                    disabled={loading}
                  />
                ))}
              </div>

              {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <div className='flex justify-end gap-3 mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setCurrentTab('main')
                    setSelectedColor(list?.color || '#ffffff')
                    setMessage({ type: '', text: '' })
                  }}
                  className='px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors'
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type='button'
                  onClick={handleUpdateColor}
                  className='px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50'
                  disabled={loading || selectedColor === list?.color}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Tab */}
        {currentTab === 'delete' && (
          <>
            <div className='bg-gradient-to-r from-red-700 to-red-500 p-4 text-white'>
              <h2 className='text-xl font-bold'>Eliminar lista</h2>
              <p className='text-red-100 text-sm'>Esta acción no se puede deshacer</p>
            </div>
            <div className='p-6'>
              <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
                <p className='text-gray-800 text-sm'>
                  ¿Estás seguro de que deseas eliminar la lista <span className='font-bold'>"{list?.name}"</span>? Esta acción eliminará la lista y todo su contenido de forma permanente.
                </p>
              </div>

              {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <div className='flex justify-end gap-3 mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setCurrentTab('main')
                    setMessage({ type: '', text: '' })
                  }}
                  className='px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors'
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type='button'
                  onClick={handleDeleteList}
                  className='px-6 py-2 bg-gradient-to-r from-red-700 to-red-500 text-white font-bold rounded-lg hover:bg-red-700 cursor-pointer transition-colors disabled:opacity-50'
                  disabled={loading}
                >
                  {loading ? 'Eliminando...' : 'Sí, Eliminar'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
