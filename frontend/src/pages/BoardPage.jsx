import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ListColumn } from '../components/ListColumn'
import { CreateListModal } from '../components/CreateListModal'
import { ListProvider, useLists } from '../context/ListContext'
import { useBoards } from '../context/BoardContext'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { reorderListsReq } from '../services/listService'
import { ArchivedElementsModal } from '../components/ArchivedElementsModal'
import { ActivitySidebar } from '../components/ActivitySidebar'

const BoardPageContent = () => {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const [showListModal, setShowListModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [currentBoardInfo, setCurrentBoardInfo] = useState(null)
  const { lists, loading, loadLists, isHistoryOpen, setIsHistoryOpen, logActivity } = useLists()
  const { boards, setCurrentBoard } = useBoards()
  const [localLists, setLocalLists] = useState([])

  useEffect(() => {
    if (lists) setLocalLists(lists)
  }, [lists])

  useEffect(() => {
    // Buscamos el objeto del tablón actual dentro del array global de boards
    const current = boards.find(b => b.id === boardId)
    // Si hay tablon actual, se lo asignamos a currentBoard en BoardContext
    if (current) {
      setCurrentBoard(current)
      setCurrentBoardInfo(current)
    }

    // Si salimos del tablón, limpiamos ambos estados gracias a useEffect
    return () => {
      setCurrentBoard(null)
      setCurrentBoardInfo(null)
    }
  }, [boardId, boards, setCurrentBoard])

  useEffect(() => {
    loadLists()
  }, [loadLists])

  // Configuración del sensor: Permite clics normales en tareas sin arrastrar
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // El usuario debe arrastrar al menos 5px para activar el modo Drag
      },
    })
  )

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    // VALIDACIÓN DE SEGURIDAD: Si el elemento arrastrado no pertenece a las listas, lo ignoramos
    const isAList = localLists.some((list) => list.id === active.id)
    if (!isAList) return

    // Calculamos el nuevo orden en el cliente (Optimistic UI)
    const oldIndex = localLists.findIndex((list) => list.id === active.id)
    const newIndex = localLists.findIndex((list) => list.id === over.id)
    // Obtenemos la lista movida para escribirla en el historial
    const draggedList = localLists[oldIndex]
    const newOrder = arrayMove(localLists, oldIndex, newIndex)

    // Modificamos el estado visual de inmediato para que sea instantáneo
    setLocalLists(newOrder)

    // Formateamos el array con la estructura [{ id, order }] que pide tu validador de Zod
    const payload = newOrder.map((list, index) => ({
      id: list.id,
      order: index
    }))

    try {
      // Llamamos a tu servicio nativo de la aplicación
      await reorderListsReq(boardId, payload)
      logActivity(`Reordenaste las listas. "${draggedList.name}" pasó de la posición ${oldIndex + 1} a la ${newIndex + 1}.`)
      console.log('¡Orden de listas sincronizado en la base de datos!')
    } catch (error) {
      console.error('Error al guardar el reordenamiento:', error)
      // Si el servidor falla (ej. error 500 o de red), revertimos el cambio visual al estado original
      setLocalLists(lists)
    }
  }

  if (loading) {
    return <p className='p-10 text-center text-gray-600'>Cargando tablón...</p>
  }

  return (
    <div className={`min-h-screen bg-gray-50 p-8 transition-all duration-300 ${isHistoryOpen ? 'max-sm:overflow-hidden' : ''}`}>

      {/* CABECERA DEL TABLERO */}
      <div className='mb-8 flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>{currentBoardInfo ? currentBoardInfo.name : 'Tablón'}</h1>
          <p className='text-gray-600 mt-2'>{localLists.length} lista(s)</p>
        </div>

        {/* Acciones de la cabecera */}
        <div className='flex items-center gap-3'>
          {/* Botón de Elementos Archivados integrado estéticamente */}
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className={`px-3.5 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm ${
              isHistoryOpen
                ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-100'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
            title="Ver historial de cambios"
          >
            <img
              src="../SVG Stopwatch.svg"
              alt="Ocultar barra lateral"
              className="w-5 h-5 opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </button>
          <button
            onClick={() => setShowArchiveModal(true)}
            className='px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm'
          >
            <img
              src="../SVG Archive Icon.svg"
              alt="Ocultar barra lateral"
              className="w-5 h-5 opacity-90 group-hover:opacity-100 invert transition-opacity"
            />
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer'
          >
            ← Volver
          </button>
        </div>
      </div>

      {/* RENDERIZADO DE LISTAS Y DRAG AND DROP */}
      <div className='overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300'>
        <div className='flex gap-6 min-w-min'>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={localLists.map(l => l.id)} strategy={horizontalListSortingStrategy}>
              {localLists.map(list => (
                <ListColumn key={list.id} list={list} boardId={boardId} />
              ))}
            </SortableContext>
          </DndContext>

          <div className='flex-shrink-0 w-80'>
            <button
              onClick={() => setShowListModal(true)}
              className='w-full h-full min-h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center bg-white cursor-pointer'
            >
              <div className='text-center'>
                <p className='text-4xl text-gray-400 mb-2'>+</p>
                <p className='text-gray-600'>Nueva lista</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Modales controlados */}
      <CreateListModal
        isOpen={showListModal}
        onClose={() => setShowListModal(false)}
      />

      {/* Inyección del Modal de Archivados */}
      <ArchivedElementsModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        boardId={boardId}
      />

      <ActivitySidebar />
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
