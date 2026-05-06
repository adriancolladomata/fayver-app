import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function App () {
  const { user, loading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)

  // mientras comprobamos si hay usuario o no, mostramos una pantalla de carga
  if (loading) return <h1>Iniciando sesión en Fayver...</h1>

  const toggleAuth = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className='App'>
      {user ? (
        <h1>Bienvenido de nuevo, {user.name}</h1>
      ) : isLogin ? (
        <LoginPage onToggleAuth={toggleAuth} />
      ) : (
        <RegisterPage onToggleAuth={toggleAuth} />
      )}
    </div>
  )
}

export default App
