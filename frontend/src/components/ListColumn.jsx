import { useState, useEffect } from 'react'
import { CreateTaskModal } from './CreateTaskModal'
import { ListSettingsModal } from './ListSettingsModal'
import { TaskDetailsModal } from './TaskDetailsModal'
import { useLists } from '../context/ListContext'
import { useTasks } from '../hooks/useTasks'
import { useBoards } from '../context/BoardContext'
import { useActivity } from '../context/ActivityContext'
import { useSortable, SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { updateTasksOrderReq } from '../services/taskService'
import { getActivityMessage } from '../utils/activityLogs'

// Componente Envolvedor interno para cada tarjeta de Tarea para que sea Sortable
const SortableTaskItem = ({ task, onClick, onToggleComplete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className='bg-gray-50 p-3 rounded border border-gray-200 hover:shadow-md transition-shadow flex items-start gap-2 cursor-pointer select-none'
    >
      {/* Indicador visual para arrastrar (Se lleva los listeners y attributes) */}
      <div
        {...attributes}
        {...listeners}
        className='cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-0.5 mt-0.5 font-bold text-xs tracking-tighter'
        title='Arrastrar tarea'
        onClick={(e) => e.stopPropagation()} // Evita que abra el modal al arrastrar
      >
        ⋮⋮
      </div>

      <input
        type='checkbox'
        checked={!!task.is_completed}
        onClick={(e) => e.stopPropagation()}
        onChange={onToggleComplete}
        className='mt-1 cursor-pointer accent-green-600 h-4 w-4 rounded flex-shrink-0'
      />

      <div className='flex-1 min-w-0'>
        <div className='space-y-1'>
          <p className={`text-sm font-medium transition-all break-words ${
            task.is_completed ? 'line-through text-gray-400 font-normal' : 'text-gray-800'
          }`}>
            {task.name}
          </p>
          {task.color && task.color !== '#ffffff' && (
            <span className='block h-1 w-full rounded-full' style={{ backgroundColor: task.color }} />
          )}
          {task.label && task.label.trim() ? (
            <div className='flex flex-wrap gap-1.5 mt-2'>
              {task.label.split(',').map((tag, index) => {
                const cleanTag = tag.trim()
                if (!cleanTag) return null
                return (
                  <span
                    key={`${cleanTag}-${index}`}
                    className='text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200/60'
                  >
                    {cleanTag}
                  </span>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export const ListColumn = ({ list, boardId }) => {
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [activeTask, setActiveTask] = useState(null)
  const { lists } = useLists()
  const { deleteTask, updateTask } = useTasks(boardId)
  const { logActivity } = useActivity()
  const { currentBoard } = useBoards()

  // ESTADO LOCAL DE TAREAS PARA OPTIMISTIC UI
  const [localTasks, setLocalTasks] = useState([])

  useEffect(() => {
    if (list.tasks) {
      setLocalTasks(list.tasks)
    }
  }, [list.tasks])

  // Inicializar dnd-kit para la LISTA/COLUMNA misma
  const {
    attributes: listAttributes,
    listeners: listListeners,
    setNodeRef: setListRef,
    transform: listTransform,
    transition: listTransition,
    isDragging: isListDragging
  } = useSortable({ id: list.id })

  const listStyle = {
    transform: CSS.Translate.toString(listTransform),
    transition: listTransition,
    opacity: isListDragging ? 0.4 : 1,
  }

  // Configuración de sensores para las tareas
  const taskSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  )

  // MANEJADOR DEL ARRASTRE DE TAREAS INTERNAS
  const handleTaskDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = localTasks.findIndex(t => t.id === active.id)
    const newIndex = localTasks.findIndex(t => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const draggedTask = localTasks[oldIndex]
    const newTasksOrder = arrayMove(localTasks, oldIndex, newIndex)

    // Actualización inmediata del UI
    setLocalTasks(newTasksOrder)

    // Formatear payload para el backend de Zod: [{ id, order }]
    const payload = newTasksOrder.map((task, index) => ({
      id: task.id,
      order: index
    }))

    try {
      // Usamos el servicio de tareas apuntando al endpoint masivo
      await updateTasksOrderReq(boardId, list.id, payload)
      logActivity(getActivityMessage('TASK_REORDER', {
        listName: list.name,
        draggedName: draggedTask.name,
        oldIndex,
        newIndex,
        boardName: currentBoard?.name
      }))
      console.log('¡Orden de tareas guardado en base de datos!')
    } catch (error) {
      console.error('Error al reordenar tareas:', error)
      setLocalTasks(list.tasks || []) // Revertir si hay error de red/servidor
    }
  }

  const handleToggleComplete = async (taskId, currentStatus) => {
    const targetTask = localTasks.find(t => t.id === taskId)
    const taskName = targetTask ? targetTask.name : 'Tarea'
    try {
      await updateTask(list.id, taskId, { is_completed: !currentStatus })
      logActivity(getActivityMessage('TASK_TOGGLE', {
        taskName: taskName,
        status: !currentStatus ? 'completada' : 'pendiente',
        listName: list.name,
        boardName: currentBoard?.name
      }))
    } catch (error) {
      console.error('Error al cambiar estado de la tarea:', error)
    }
  }

  return (
    <>
      <div
        ref={setListRef}
        style={listStyle}
        className='bg-white rounded-lg shadow p-4 w-80 flex-shrink-0 flex flex-col'
      >
        <div className='flex justify-between items-center mb-4'>
          {/* CABECERA DE LA COLUMNA (Arrastre de listas) */}
          <h3
            {...listAttributes}
            {...listListeners}
            className='font-bold text-gray-800 text-lg flex items-center gap-2 flex-1 cursor-grab active:cursor-grabbing select-none'
            title='Mantén presionado para mover la lista'
          >
            {list.color && list.color !== '#ffffff' && (
              <div className='w-3 h-3 rounded-full' style={{ backgroundColor: list.color }}></div>
            )}
            {list.name}
          </h3>

          <button
            onClick={() => setShowSettingsModal(true)}
            className='w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex items-center justify-center'
            title='Configurar lista'
          >
            <img src='../SVGDotsVertical.svg' alt='Icono tres puntos' className='w-5 h-5' />
          </button>
        </div>

        {/* ZONA DE TAREAS: ENCAPSULADA CON SU PROPIO CONTEXTO DND */}
        <div className='space-y-2 mb-4 max-h-96 overflow-y-auto custom-scrollbar flex-1'>
          <DndContext sensors={taskSensors} collisionDetection={closestCenter} onDragEnd={handleTaskDragEnd}>
            <SortableContext items={localTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {localTasks.length > 0 ? (
                localTasks.map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    onClick={() => setActiveTask(task)}
                    onToggleComplete={() => handleToggleComplete(task.id, task.is_completed)}
                  />
                ))
              ) : (
                <p className='text-gray-400 text-sm text-center py-4'>Sin tareas</p>
              )}
            </SortableContext>
          </DndContext>
        </div>

        <button
          onClick={() => setShowTaskModal(true)}
          className='w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium cursor-pointer mt-auto'
        >
          + Nueva tarea
        </button>
      </div>

      <CreateTaskModal listId={list.id} boardId={boardId} isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} />
      {/* 🛠️ CAMBIO: Control preventivo: Solo montamos TaskDetailsModal si activeTask no es nulo, protegiendo los ciclos de hooks de la modal */}
      {activeTask && (
        <TaskDetailsModal
          isOpen={!!activeTask}
          onClose={() => setActiveTask(null)}
          task={activeTask}
          boardId={boardId}
          listId={list.id}
          tasks={list.tasks || []}
        />
      )}
      <TaskDetailsModal isOpen={!!activeTask} onClose={() => setActiveTask(null)} task={activeTask} boardId={boardId} listId={list.id} tasks={list.tasks} />
      <ListSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} list={list} boardId={boardId} allLists={lists} />
    </>
  )
}
