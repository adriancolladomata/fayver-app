import { useAuth } from './context/AuthContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { Sidebar } from './components/Sidebar'
import { NavBar } from './components/NavBar'

// Definición del componente principal App de la aplicación.
function App () {
  // Desestructuración de los valores del contexto de la aplicación
  const { user, loading } = useAuth()

  // Mientras comprobamos si hay usuario o no, mostramos una pantalla de carga
  if (loading) return <h1>Iniciando sesión en Fayver...</h1>

  return (
    <BrowserRouter>
      {/* Si el usuario está logueado, muestra el Sidebar + NavBar + contenido */}
      {user ? (
        // Usamos h-screen y overflow-hidden para que el layout ocupe el 100% de la ventana sin romper
        <div className='flex h-screen bg-gray-50 overflow-hidden'>
          <Sidebar />

          {/* Contenedor derecho: flex-col para poner la NavBar arriba y el contenido abajo */}
          <div className='flex-1 flex flex-col'>
            {/* Renderizamos la barra de navegación aquí, arriba de las rutas */}
            <NavBar />

            {/* Contenedor principal de las páginas con scroll independiente */}
            <main className='flex-1 overflow-y-auto p-6'>
              <Routes>
                <Route path='/dashboard' element={<DashboardPage />}></Route>
                <Route path='/board/:boardId' element={<h1>Contenido del tablon (Proximamente...)</h1>}></Route>
                {/* Si el usuario intenta ir a /login estando logueado, lo mandamos al dashboard */}
                <Route path='/login' element={<Navigate to='/dashboard' replace />} />
                <Route path='*' element={<Navigate to='/dashboard' replace />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        /* Si no está logueado, muestra solo las rutas públicas */
        <div className='min-h-screen bg-gray-50'>
          <Routes>
            <Route path='/login' element={<LoginPage />}></Route>
            <Route path='/register' element={<RegisterPage />}></Route>
            {/* Es mejor usar Navigate en el comodín para mantener la URL limpia */}
            <Route path='*' element={<Navigate to='/login' replace />}></Route>
          </Routes>
        </div>
      )}
    </BrowserRouter>
  )
}

export default App
