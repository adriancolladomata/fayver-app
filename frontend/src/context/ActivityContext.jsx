import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ActivityContext = createContext()

export const useActivity = () => {
  const context = useContext(ActivityContext)
  if (!context) throw new Error('useActivity debe usarse dentro de un ActivityProvider')
  return context
}

export const ActivityProvider = ({ children }) => {
  // Inicializamos el estado leyendo el localStorage
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('fayver_global_logs')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Sincronizamos con localStorage cada vez que activities cambie
  useEffect(() => {
    localStorage.setItem('fayver_global_logs', JSON.stringify(activities))
  }, [activities])

  // La nueva función de logActivity (globalizada)
  const logActivity = useCallback((actionText) => {
    const newActivity = {
      id: crypto.randomUUID(),
      text: actionText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString() // Añadimos fecha ya que es un log a largo plazo
    }

    // Mantenemos un histórico de las últimas 50 acciones (al ser global, necesitamos más)
    setActivities(prev => [newActivity, ...prev].slice(0, 50))
  }, [])

  // Función para vaciar el historial
  const clearActivity = useCallback(() => {
    setActivities([])
  }, [])

  return (
    <ActivityContext.Provider value={{ activities, logActivity, isHistoryOpen, setIsHistoryOpen, clearActivity }}>
      {children}
    </ActivityContext.Provider>
  )
}
