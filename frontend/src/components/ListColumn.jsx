import { useState } from 'react'
import { CreateTaskModal } from './CreateTaskModal'
import { ListSettingsModal } from './ListSettingsModal'
import { useLists } from '../context/ListContext'
import { useTasks } from '../hooks/useTasks'

export const ListColumn = ({ list, boardId }) => {
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const { lists } = useLists()
  const { deleteTask, updateTask } = useTasks()

  const handleDeleteTask = async (taskId) => {
    if (confirm('¿Eliminar esta tarea?')) {
      try {
        await deleteTask(list.id, taskId)
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      // Mandamos el inverso del booleano (mysql2 mapeará true/false a 1/0 automáticamente)
      await updateTask(list.id, taskId, { is_completed: !currentStatus })
    } catch (error) {
      console.error('Error al cambiar estado de la tarea:', error)
    }
  }

  return (
    <>
      <div className='bg-white rounded-lg shadow p-4 w-80 flex-shrink-0'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-bold text-gray-800 text-lg flex items-center gap-2'>
            {list.color && list.color !== '#ffffff' && (
              <div
                className='w-3 h-3 rounded-full'
                style={{ backgroundColor: list.color }}
              ></div>
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

        <div className='space-y-2 mb-4 max-h-96 overflow-y-auto'>
          {list.tasks && list.tasks.length > 0 ? (
            list.tasks.map((task) => (
              <div
                key={task.id}
                className='bg-gray-50 p-3 rounded border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-start gap-2'
              >
                {/* Checkbox para completar tarea */}
                <input
                  type='checkbox'
                  checked={!!task.is_completed}
                  onChange={() => handleToggleComplete(task.id, task.is_completed)}
                  className='mt-1 cursor-pointer accent-green-600 h-4 w-4 rounded'
                />

                <div className='flex-1'>
                  {/* Si está completada se tacha el texto de forma dinámica */}
                  <p className={`text-sm font-medium transition-all ${
                    task.is_completed ? 'line-through text-gray-400 font-normal' : 'text-gray-800'
                  }`}>
                    {task.name}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className='text-red-500 hover:text-red-700 text-xs cursor-pointer'
                  title='Eliminar'
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className='text-gray-400 text-sm text-center py-4'>Sin tareas</p>
          )}
        </div>

        <button
          onClick={() => setShowTaskModal(true)}
          className='w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium cursor-pointer'
        >
          + Nueva tarea
        </button>
      </div>

      <CreateTaskModal
        listId={list.id}
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
      />

      <ListSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        list={list}
        boardId={boardId}
        allLists={lists}
      />
    </>
  )
}
