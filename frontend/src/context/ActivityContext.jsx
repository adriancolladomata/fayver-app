import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ActivityContext = createContext()

export const useActivity = () => {
  const context = useContext(ActivityContext)
  if (!context) throw new Error('useActivity debe usarse dentro de un ActivityProvider')
  return context
}

export const ActivityProvider = ({ children }) => {
  const { user } = useAuth()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Inicializamos con un array vacío (seguro para el login)
  const [activities, setActivities] = useState([])

  // Cargamos las actividades específicas cada vez que el usuario cambie o inicie sesión
  useEffect(() => {
    if (user?.id) {
      try {
        const saved = localStorage.getItem(`fayver_logs_${user.id}`)
        setActivities(saved ? JSON.parse(saved) : [])
      } catch (e) {
        setActivities([])
      }
    } else {
      // Si no hay usuario (logout), limpiamos la memoria RAM y cerramos el panel,
      // pero NO borramos el localStorage para que los logs sigan ahí cuando vuelva
      setActivities([])
      setIsHistoryOpen(false)
    }
  }, [user])

  // Guardamos en localStorage las actividades del usuario cuando cambian
  useEffect(() => {
    if (user?.id && activities.length > 0) {
      localStorage.setItem(`fayver_logs_${user.id}`, JSON.stringify(activities))
    }
  }, [activities, user])

  // Función de logActivity
  const logActivity = useCallback((actionText) => {
    const newActivity = {
      id: crypto.randomUUID(),
      text: actionText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    }

    setActivities(prev => [newActivity, ...prev].slice(0, 50))
  }, [])

  // Función para vaciar el historial del usuario actual
  const clearActivity = useCallback(() => {
    setActivities([])
    if (user?.id) {
      localStorage.removeItem(`fayver_logs_${user.id}`)
    }
  }, [user])

  return (
    <ActivityContext.Provider value={{ activities, logActivity, isHistoryOpen, setIsHistoryOpen, clearActivity }}>
      {children}
    </ActivityContext.Provider>
  )
}
