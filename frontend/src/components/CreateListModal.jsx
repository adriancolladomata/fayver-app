import { useState } from 'react'
import { useLists } from '../context/ListContext'

export const CreateListModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#ffffff')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { createList, logActivity } = useLists()

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
    if (!name.trim()) {
      setError('El nombre de la lista es requerido')
      return
    }

    try {
      setLoading(true)
      setError('')
      await createList(name.trim(), color)
      logActivity(`Creaste la lista "${name}"`)

      setName('')
      setColor('#ffffff')
      setError('')
      onClose()
    } catch (err) {
      console.error('Error completo:', err)
      const errorMsg = typeof err === 'string'
        ? err
        : err?.message
          ? err.message
          : err?.error?.message
            ? err.error.message
            : 'No se pudo crear la lista. Intenta de nuevo.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setColor('#ffffff')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
      <div className='bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>
        {/* Cabecera Azul */}
        <div className='bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white'>
          <h2 className='text-xl font-bold'>Nueva Lista</h2>
          <p className='text-blue-100 text-sm'>Dale un nombre a tu próxima lista</p>
        </div>

        <form onSubmit={handleSubmit} className='p-6'>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Nombre de la lista
            </label>
            <input
              autoFocus
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Ej: Por Hacer'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800'
              disabled={loading}
            />
          </div>

          <div className='mb-6'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Color (opcional)</label>
            <div className='flex gap-3 flex-wrap'>
              {colors.map(c => (
                <button
                  key={c}
                  type='button'
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === c ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: c }}
                  disabled={loading}
                />
              ))}
            </div>
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
              {loading ? 'Creando...' : 'Crear Lista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
