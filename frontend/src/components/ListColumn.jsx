import { useState } from 'react'
import { CreateTaskModal } from './CreateTaskModal'
import { useLists } from '../context/ListContext'

export const ListColumn = ({ list, boardId }) => {
  const [showModal, setShowModal] = useState(false)
  const { deleteTask } = useLists()

  const handleDeleteTask = async (taskId) => {
    if (confirm('¿Eliminar esta tarea?')) {
      try {
        await deleteTask(list.id, taskId)
      } catch (error) {
        console.error('Error:', error)
      }
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
        </div>

        <div className='space-y-2 mb-4 max-h-96 overflow-y-auto'>
          {list.tasks && list.tasks.length > 0 ? (
            list.tasks.map((task) => (
              <div
                key={task.id}
                className='bg-gray-50 p-3 rounded border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-start gap-2'
              >
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-800'>{task.name}</p>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className='text-red-500 hover:text-red-700 text-xs'
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
          onClick={() => setShowModal(true)}
          className='w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium'
        >
          + Nueva tarea
        </button>
      </div>

      <CreateTaskModal
        listId={list.id}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
