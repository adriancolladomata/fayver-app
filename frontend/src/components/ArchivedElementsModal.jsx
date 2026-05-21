import { useState, useEffect } from 'react'
import { getArchivedTreeReq, updateListReq, deleteListReq } from '../services/listService'
import { useConfirmation } from '../context/ConfirmationContext'
import { useLists } from '../context/ListContext'
import { useActivity } from '../context/ActivityContext'
import { getActivityMessage } from '../utils/activityLogs'
import { useBoards } from '../context/BoardContext'

export const ArchivedElementsModal = ({ isOpen, onClose, boardId }) => {
  const [structuredData, setStructuredData] = useState([])
  const [expandedLists, setExpandedLists] = useState({})
  const [loading, setLoading] = useState(false)

  const { requireConfirm } = useConfirmation()
  const { loadLists } = useLists()
  const { logActivity } = useActivity()
  const { currentBoard } = useBoards()

  const fetchArchivedStructure = async () => {
    if (!boardId) return // Seguridad por si no hay tablón cargado

    try {
      setLoading(true)
      const data = await getArchivedTreeReq(boardId)
      setStructuredData(data)
    } catch (error) {
      console.error('Error cargando estructura de archivados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && boardId) {
      fetchArchivedStructure()
    }

    // ESTA ES LA CLAVE: Cuando el modal se cierra o cambias de tablón, limpiamos los estados inmediatamente para que empiece desde cero.
    return () => {
      setStructuredData([])
      setExpandedLists({})
    }
  }, [isOpen, boardId])

  if (!isOpen) return null

  const toggleList = (listId) => {
    setExpandedLists(prev => ({ ...prev, [listId]: !prev[listId] }))
  }

  // --- ACCIONES DE RESTAURACIÓN (Afecta a la lista y sus tareas en bloque) ---
  const handleRestoreList = async (listId) => {
    try {
    // 1. Hace la petición de restauración al servidor
      await updateListReq(boardId, listId, { is_archived: false })

      // Mensaje para el historial de actividad
      const restoredList = structuredData.find(item => item.id === listId)
      logActivity(getActivityMessage('LIST_RESTORE', {
        name: restoredList?.name || 'lista',
        boardName: currentBoard?.name
      }))

      // 2. Refresca el contenido interno del modal de archivados
      await fetchArchivedStructure()

      // Le dice al contexto global que vuelva a descargar las listas activas.
      // Esto hace que la lista restaurada aparezca instantáneamente en el tablero de fondo.
      await loadLists()
    } catch (error) {
      console.error('Error al restaurar la lista:', error)
    }
  }

  // --- ACCIONES DE ELIMINACIÓN (Envía la lista a la papelera general) ---
  const handleSoftDeleteList = async (listId) => {
    const isConfirmed = await requireConfirm(
      'Eliminar Lista',
      '¿Estás seguro de que quieres eliminar esta lista? No podrás recuperarla de nuevo.'
    )
    if (isConfirmed) {
      await deleteListReq(boardId, listId)
      await fetchArchivedStructure()
      await loadLists()
      const deletedList = structuredData.find(item => item.id === listId)
      logActivity(getActivityMessage('LIST_DELETE', {
        name: deletedList?.name || 'lista',
        boardName: currentBoard?.name
      }))
    }
  }

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden'>

        {/* Cabecera */}
        <div className='bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white flex justify-between items-center shadow-md'>
          <div>
            <h2 className='text-xl font-bold flex items-center gap-2'>
              Elementos Archivados
            </h2>
            <p className='text-blue-100 text-sm mt-0.5'>Gestiona las listas archivadas de tu tablón</p>
          </div>
          <button onClick={onClose} className='text-blue-100 hover:text-white font-bold p-1 transition-colors cursor-pointer text-lg'>✕</button>
        </div>

        {/* Cuerpo Árbol */}
        <div className='flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar bg-neutral-50/50'>
          {loading ? (
          // Mientras carga, muestra un indicador elegante en lugar de decir que está vacío
            <p className='text-neutral-500 text-sm text-center py-12 animate-pulse'>Cargando elementos archivados...</p>
          ) : structuredData.length === 0 ? (
            <p className='text-neutral-400 text-sm text-center py-12'>No hay elementos archivados en este tablón.</p>
          ) : (
            structuredData.map(list => {
              const tasksToShow = list.tasks || []

              return (
                <div key={list.id} className='border border-neutral-200 rounded-lg bg-white overflow-hidden shadow-sm'>

                  {/* FILA DE LA LISTA */}
                  <div
                    onClick={() => toggleList(list.id)}
                    className='p-3.5 flex justify-between items-center cursor-pointer transition-colors select-none bg-blue-50/60 hover:bg-blue-100/50'
                  >
                    <div className='flex items-center gap-2 min-w-0'>
                      <span className='text-neutral-400 text-xs w-4 text-center'>
                        {expandedLists[list.id] ? '▼' : '►'}
                      </span>
                      <span className='text-sm font-semibold truncate text-blue-900'>
                        {list.name}
                      </span>
                      <span className='text-[11px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200'>
                        Lista archivada
                      </span>
                    </div>

                    {/* Acciones de la Lista */}
                    <div className='flex items-center gap-3' onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleRestoreList(list.id)} className='text-sm text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer transition-colors'>Restaurar</button>
                      <button onClick={() => handleSoftDeleteList(list.id)} className='text-sm text-rose-500 hover:text-rose-700 font-bold cursor-pointer transition-colors'>Eliminar</button>
                    </div>
                  </div>

                  {/* SUBELEMENTOS: TAREAS (Vista informativa de "Tareas Archivadas") */}
                  {expandedLists[list.id] && (
                    <div className='bg-neutral-50/80 border-t border-neutral-100 p-2 space-y-1.5 pl-8'>
                      {tasksToShow.length > 0 ? (
                        tasksToShow.map(task => (
                          <div key={task.id} className='bg-white p-3 rounded-md border border-neutral-200/80 shadow-sm flex justify-between items-center gap-4 text-sm'>
                            <span className='text-neutral-600 font-medium break-words min-w-0 flex-1'>{task.name}</span>
                          </div>
                        ))
                      ) : (
                        <p className='text-xs text-neutral-400 italic py-2 pl-2'>No hay tareas en esta lista.</p>
                      )}
                    </div>
                  )}

                </div>
              )
            })
          )}
        </div>

        {/* Pie */}
        <div className='p-4 border-t border-neutral-100 bg-white text-right rounded-b-xl'>
          <button onClick={onClose} className='px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors cursor-pointer'>
            Cerrar
          </button>
        </div>

      </div>
    </div>
  )
}
