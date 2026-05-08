import { useState } from 'react'
import { useLists } from '../context/ListContext'

export const CreateListModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#ffffff')
  const [loading, setLoading] = useState(false)
  const { createList } = useLists()

  const colors = [
    '#ffffff',
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#ffd93d',
    '#6bcf7f',
    '#a78bfa'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setLoading(true)
      await createList(name.trim(), color)
      setName('')
      setColor('#ffffff')
      onClose()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear la lista')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-96 shadow-xl'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Nueva Lista</h2>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Nombre de la lista'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full bg-gray-50 text-gray-800 px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none mb-4'
            autoFocus
            disabled={loading}
          />
          
          <label className='block text-sm text-gray-600 mb-2'>Color (opcional)</label>
          <div className='flex gap-2 mb-4 flex-wrap'>
            {colors.map(c => (
              <button
                key={c}
                type='button'
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === c ? 'border-gray-800 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c }}
                disabled={loading}
              />
            ))}
          </div>

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
