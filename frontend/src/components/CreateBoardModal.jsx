import { useState } from 'react'
import { createBoardReq } from '../services/boardService'
import { useBoards } from '../context/BoardContext'

export const CreateBoardModal = ({ isOpen, onClose, onBoardCreated }) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { createBoard } = useBoards() // Extraemos la función

  // Si isOpen es false, el componente no renderiza nada (el modal no se muestra)
  if (!isOpen) return null

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    // Evitamos que el formulaario recarguela página al hacer submit
    e.preventDefault()
    // Si el nombre está vacío, mostramos una alerta y no hacemos nada más
    if (!name.trim()) return alert('El nombre es obligatorio')

    // Indicamos que estamos en proceso de creación para deshabilitar el botón
    setLoading(true)

    try {
      // Usamos la función del BoardContext para crear el nuevo tablero, la cual se encargará de hacer la petición al backend
      // y atualizar el estado global de los tableros
      await createBoard(name)
      // Limpiamos y cerramos
      setName('')
      // Cerramos el modal
      onClose()
    } catch (error) {
      // En caso de error, lo mostramos en consola y alertamos al usuario
      console.error('Error al crear:', error)
      alert('No se pudo crear el tablón')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
      {/* Contenedor del Modal */}
      <div className='bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>

        {/* Cabecera Azul */}
        <div className='bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white'>
          <h2 className='text-xl font-bold'>Crear nuevo tablón</h2>
          <p className='text-blue-100 text-sm'>Dale un nombre a tu próximo proyecto</p>
        </div>

        <form onSubmit={handleSubmit} className='p-6'>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Nombre del tablón
            </label>
            <input
              autoFocus
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Ej: Diseño de Interfaz'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800'
            />
          </div>

          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50'
            >
              {loading ? 'Creando...' : 'Crear Tablón'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
