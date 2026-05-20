import { useState, useEffect } from 'react'
import { getArchivedTreeReq, updateListReq, deleteListReq } from '../services/listService'
import { updateTaskReq, deleteTaskReq } from '../services/taskService'
import { useConfirmation } from '../context/ConfirmationContext'
import { useLists } from '../context/ListContext'

export const ArchivedElementsModal = ({ isOpen, onClose, boardId }) => {
  const [structuredData, setStructuredData] = useState([])
  const [expandedLists, setExpandedLists] = useState({})

  // Consumimos tus contextos geniales
  const { requireConfirm } = useConfirmation()
  const { loadLists } = useLists() // Para recargar el tablero principal al restaurar algo

  const fetchArchivedStructure = async () => {
    try {
      const data = await getArchivedTreeReq(boardId)
      setStructuredData(data)
    } catch (error) {
      console.error('Error cargando estructura de archivados:', error)
    }
  }

  useEffect(() => {
    if (isOpen) fetchArchivedStructure()
  }, [isOpen, boardId])

  if (!isOpen) return null

  const toggleList = (listId) => {
    setExpandedLists(prev => ({ ...prev, [listId]: !prev[listId] }))
  }

  // --- ACCIONES DE RESTAURACIÓN ---
  const handleRestoreList = async (listId) => {
    await updateListReq(boardId, listId, { is_archived: false })
    await fetchArchivedStructure() // Recarga el modal
    await loadLists() // Recarga el tablero principal
  }

  const handleRestoreTask = async (listId, taskId) => {
    await updateTaskReq(boardId, listId, taskId, { is_archived: false })
    await fetchArchivedStructure()
    await loadLists()
  }

  // --- ACCIONES DE ELIMINACIÓN (Usando tu ConfirmationContext) ---
  const handleSoftDeleteList = async (listId) => {
    const isConfirmed = await requireConfirm(
      'Eliminar Lista',
      '¿Estás seguro de que quieres enviar esta lista a la papelera? Podrás recuperarla desde la papelera general.'
    )
    if (isConfirmed) {
      await deleteListReq(boardId, listId)
      fetchArchivedStructure()
    }
  }

  const handleSoftDeleteTask = async (listId, taskId) => {
    const isConfirmed = await requireConfirm(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea de forma permanente?'
    )
    if (isConfirmed) {
      await deleteTaskReq(boardId, listId, taskId)
      fetchArchivedStructure()
    }
  }

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200'>

        {/* Cabecera */}
        <div className='p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50 rounded-t-xl'>
          <h2 className='text-lg font-bold text-neutral-800 flex items-center gap-2'>
            Elementos Archivados
          </h2>
          <button onClick={onClose} className='text-neutral-400 hover:text-neutral-600 font-bold p-1 cursor-pointer'>✕</button>
        </div>

        {/* Cuerpo Árbol Unificado */}
        <div className='flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar bg-neutral-50/50'>
          {structuredData.length === 0 ? (
            <p className='text-neutral-400 text-sm text-center py-12'>No hay elementos archivados en este tablón.</p>
          ) : (
            structuredData.map(list => {
              const tasksToShow = list.is_archived ? list.tasks : list.tasks?.filter(t => t.is_archived)

              return (
                <div key={list.id} className='border border-neutral-200 rounded-lg bg-white overflow-hidden shadow-sm'>

                  {/* FILA DE LA LISTA */}
                  <div
                    onClick={() => toggleList(list.id)}
                    className={`p-3.5 flex justify-between items-center cursor-pointer transition-colors select-none ${
                      list.is_archived ? 'bg-amber-50/60 hover:bg-amber-100/60' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className='flex items-center gap-2 min-w-0'>
                      <span className='text-neutral-400 text-xs w-4 text-center'>
                        {expandedLists[list.id] ? '▼' : '►'}
                      </span>
                      <span className={`text-sm font-semibold truncate ${list.is_archived ? 'text-amber-900' : 'text-neutral-700'}`}>
                        {list.name}
                      </span>
                      {list.is_archived && (
                        <span className='text-[10px] bg-amber-200/50 text-amber-700 font-bold px-2 py-0.5 rounded-full'>Lista archivada</span>
                      )}
                    </div>

                    {/* Acciones de la Lista */}
                    {list.is_archived && (
                      <div className='flex items-center gap-3' onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleRestoreList(list.id)} className='text-xs text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer'>Restaurar</button>
                        <button onClick={() => handleSoftDeleteList(list.id)} className='text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer'>Eliminar</button>
                      </div>
                    )}
                  </div>

                  {/* SUBELEMENTOS: TAREAS */}
                  {expandedLists[list.id] && (
                    <div className='bg-neutral-50/80 border-t border-neutral-100 p-2 space-y-1.5 pl-8'>
                      {tasksToShow && tasksToShow.length > 0 ? (
                        tasksToShow.map(task => (
                          <div key={task.id} className='bg-white p-3 rounded-md border border-neutral-200/80 shadow-sm flex justify-between items-center gap-4 text-sm hover:border-neutral-300 transition-colors'>
                            <span className='text-neutral-700 font-medium break-words min-w-0 flex-1'>{task.name}</span>

                            {/* Acciones de la Tarea */}
                            <div className='flex items-center gap-3 flex-shrink-0'>
                              <button onClick={() => handleRestoreTask(list.id, task.id)} className='text-xs text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer'>Restaurar</button>
                              <button onClick={() => handleSoftDeleteTask(list.id, task.id)} className='text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer'>Eliminar</button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className='text-xs text-neutral-400 italic py-2 pl-2'>No hay tareas archivadas en esta lista.</p>
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
          <button onClick={onClose} className='px-5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-bold transition-colors cursor-pointer'>
            Cerrar
          </button>
        </div>

      </div>
    </div>
  )
}
