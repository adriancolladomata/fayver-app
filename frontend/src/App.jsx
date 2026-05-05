import { useAuth } from './context/AuthContext'
import { LoginPage } from './pages/LoginPage'

function App () {
  const { user, loading } = useAuth()

  // mientras comprobamos si hay usuario o no, mostramos una pantalla de carga
  if (loading) return <h1>Iniciando sesión en Fayver...</h1>

  return (
    <div className='App'>
      {user ? (
        <h1>Bienvenido de nuevo, {user.name}</h1>
      ) : (
        <LoginPage />
      )}
    </div>
  )
}

export default App
