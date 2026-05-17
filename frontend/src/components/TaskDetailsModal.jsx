import { useEffect, useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useToast } from '../context/ToastContext' // 🎯 Importamos el Toast global
import { useConfirmation } from '../context/ConfirmationContext' // 🎯 Importamos la Confirmación global

const colorOptions = [
  '#ffffff',
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#ffd93d',
  '#6bcf7f',
  '#a78bfa'
]

export const TaskDetailsModal = ({ isOpen, onClose, task, boardId, listId, tasks = [] }) => {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('#ffffff')
  const [tags, setTags] = useState('')
  const [order, setOrder] = useState(0)
  const [loading, setLoading] = useState(false)

  const { showToast } = useToast()
  const { requireConfirm } = useConfirmation()
  const { updateTask, deleteTask } = useTasks(boardId)

  useEffect(() => {
    if (!task) return

    setName(task.name || '')
    setContent(task.content || '')
    setColor(task.color || '#ffffff')
    setTags(task.label || '')
    setOrder(task.order ?? 0)
  }, [task])

  const handleSave = async (event) => {
    event.preventDefault()
    if (!task) return

    const trimmedName = name.trim()
    const trimmedContent = content.trim()
    const trimmedTags = tags.trim()
    const updateData = {}

    if (trimmedName.length === 0) {
      showToast('El nombre de la tarea no puede estar vacío.', 'error')
      return
    }

    if (trimmedName !== task.name) updateData.name = trimmedName
    if (color !== (task.color || '#ffffff')) updateData.color = color
    if (trimmedContent !== (task.content || '').trim()) updateData.content = trimmedContent || null
    if (trimmedTags !== (task.label || '').trim()) updateData.label = trimmedTags || null

    const newOrder = Number(order)
    if (!Number.isNaN(newOrder) && newOrder !== task.order) {
      updateData.order = newOrder
    }

    if (Object.keys(updateData).length === 0) {
      showToast('No hay cambios para guardar.', 'error')
      return
    }

    try {
      setLoading(true)
      await updateTask(listId, task.id, updateData)
      showToast('Tarea guardada correctamente.', 'success')
      onClose() // 🎯 Cierre inmediato sin setTimeout molesto
    } catch (error) {
      console.error('Error al guardar tarea:', error)
      showToast('No se pudo guardar la tarea.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!task) return

    // 🎯 Quitamos el "if (!task || !confirm(...))" que tenías duplicado arriba
    const hasConfirmed = await requireConfirm(
      '¿Eliminar esta tarea?',
      `Estás a punto de borrar "${task.name}". Todos los comentarios y descripciones dentro de ella desaparecerán.`
    )

    if (!hasConfirmed) return

    try {
      setLoading(true)
      await deleteTask(listId, task.id)
      showToast('Tarea eliminada con éxito', 'success')
      onClose() // 🎯 Cierra el modal de detalles enseguida tras borrar
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
      showToast('No se pudo eliminar la tarea.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  if (!isOpen || !task) return null

  const previewName = name.trim() || task.name || ''
  const previewTags = tags.trim()

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
      <div className='bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>
        <div className='bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white'>
          <h2 className='text-xl font-bold'>Editar tarea</h2>
          <p className='text-blue-100 text-sm'>Modifica el detalle de "{task.name}"</p>
        </div>

        <form onSubmit={handleSave} className='p-6 space-y-5'>
          <div className='grid gap-4 md:grid-cols-2'>
            <label className='space-y-2 text-sm text-gray-700'>
              Nombre
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                disabled={loading}
              />
            </label>

            <label className='space-y-2 text-sm text-gray-700'>
              Orden en la lista
              <select
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                disabled={loading}
              >
                {tasks.map((_, index) => (
                  <option key={index} value={index}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className='space-y-2 text-sm text-gray-700 block'>
            Contenido
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows='4'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none'
              disabled={loading}
            />
          </label>

          <label className='space-y-2 text-sm text-gray-700 block'>
            Etiquetas personalizadas
            <input
              type='text'
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder='Ej: Urgente, Frontend, Review'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
              disabled={loading}
            />
          </label>

          <div className='space-y-3'>
            <p className='text-sm font-semibold text-gray-700'>Color de la tarea</p>
            <div className='flex flex-wrap gap-3'>
              {colorOptions.map((option) => (
                <button
                  key={option}
                  type='button'
                  onClick={() => setColor(option)}
                  className={`h-10 w-10 rounded-full border transition-transform ${
                    color === option ? 'border-black scale-105' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: option }}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className='rounded-xl border border-gray-200 p-4'>
            <p className='text-sm text-gray-600 mb-2'>Vista previa</p>
            <div className='flex flex-col gap-2'>
              <p className='font-semibold text-gray-800'>{previewName}</p>
              {color && color !== '#ffffff' && (
                <div className='h-1 rounded-full' style={{ backgroundColor: color }} />
              )}
              {previewTags ? (
                <div className='flex flex-wrap gap-2'>
                  {previewTags.split(',').map((tag) => (
                    <span
                      key={tag.trim()}
                      className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full'
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* 🎯 Limpiado el bloque HTML obsoleto de {message.text && ...} */}

          <div className='flex flex-col gap-3 md:flex-row md:justify-between'>
            <button
              type='button'
              onClick={handleDelete}
              className='w-full md:w-auto px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50'
              disabled={loading}
            >
              Eliminar tarea
            </button>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <button
                type='button'
                onClick={handleClose}
                className='w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50'
                disabled={loading}
              >
                Cerrar
              </button>
              <button
                type='submit'
                className='w-full sm:w-auto px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50'
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
