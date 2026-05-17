import { createContext, useContext, useState, useCallback } from 'react'

const ConfirmationContext = createContext()

export const ConfirmationProvider = ({ children }) => {
  const [config, setConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    resolveRef: null
  })

  // Esta función devuelve una Promesa que se resolverá con true o false
  const requireConfirm = useCallback((title, message) => {
    return new Promise((resolve) => {
      setConfig({
        isOpen: true,
        title,
        message,
        resolveRef: resolve // Guardamos la función resolve para activarla desde los botones
      })
    })
  }, [])

  const handleCancel = () => {
    if (config.resolveRef) config.resolveRef(false)
    setConfig(prev => ({ ...prev, isOpen: false }))
  }

  const handleConfirm = () => {
    if (config.resolveRef) config.resolveRef(true)
    setConfig(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <ConfirmationContext.Provider value={{ requireConfirm }}>
      {children}

      {/* Modal de Confirmación Estilizado con Tailwind */}
      {config.isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200'>
          <div className='bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-neutral-100'>

            {/* Cabecera de Alerta */}
            <div className='p-5 border-b border-neutral-100 flex items-center gap-3 bg-rose-50/50'>
              <div className='p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0'>
                <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                </svg>
              </div>
              <h3 className='text-lg font-bold text-neutral-800'>{config.title}</h3>
            </div>

            {/* Cuerpo */}
            <div className='p-6'>
              <p className='text-sm text-neutral-600 leading-relaxed'>{config.message}</p>
            </div>

            {/* Botones de Acción */}
            <div className='p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3'>
              <button
                onClick={handleCancel}
                className='px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer rounded-lg transition-colors'
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className='px-5 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer transition-colors shadow-sm shadow-rose-600/25'
              >
                Confirmar y Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmationContext.Provider>
  )
}

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext)
  if (!context) {
    throw new Error('useConfirmation debe ser usado dentro de un ConfirmationProvider')
  }
  return context
}
