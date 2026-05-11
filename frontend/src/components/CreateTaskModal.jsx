import { useState } from 'react'
import { useLists } from '../context/ListContext'

export const CreateTaskModal = ({ listId, isOpen, onClose }) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { createTask } = useLists()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('El nombre de la tarea es requerido')
      return
    }

    try {
      setLoading(true)
      setError('')
      await createTask(listId, name.trim())
      setName('')
      setError('')
      onClose()
    } catch (error) {
      console.error('Error:', error)
      setError('Error al crear la tarea')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
      <div className='bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>
        {/* Cabecera Azul */}
        <div className='bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white'>
          <h2 className='text-xl font-bold'>Nueva Tarea</h2>
          <p className='text-blue-100 text-sm'>Añade una nueva tarea a esta lista</p>
        </div>

        <form onSubmit={handleSubmit} className='p-6'>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Nombre de la tarea
            </label>
            <input
              autoFocus
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Ej: Diseñar interfaz'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800'
              disabled={loading}
            />
          </div>

          {error && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium'>
              {error}
            </div>
          )}

          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors'
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={loading || !name.trim()}
              className='px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50'
            >
              {loading ? 'Creando...' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
