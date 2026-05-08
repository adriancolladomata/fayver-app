import { useState } from 'react'
import { useLists } from '../context/ListContext'

export const CreateTaskModal = ({ listId, isOpen, onClose }) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { createTask } = useLists()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setLoading(true)
      await createTask(listId, name.trim())
      setName('')
      onClose()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear la tarea')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-96 shadow-xl'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Nueva Tarea</h2>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Nombre de la tarea'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full bg-gray-50 text-gray-800 px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none mb-4'
            autoFocus
            disabled={loading}
          />
          <div className='flex gap-2 justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors'
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50'
              disabled={loading || !name.trim()}
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
