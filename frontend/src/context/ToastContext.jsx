import { createContext, useContext, useState, useCallback } from 'react'
import { Toast } from '../components/Toast' // Ahora creamos este componente

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false })

  // useCallback evita que la función se recree en cada renderizado
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, visible: true })

    // Ocultar automáticamente tras 3 segundos
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* El Toast vive aquí, en la raíz global, inmune a las redirecciones */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider')
  }
  return context
}
