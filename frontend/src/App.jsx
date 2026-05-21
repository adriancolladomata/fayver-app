// src/App.jsx
import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { BoardPage } from './pages/BoardPage'
import { Sidebar } from './components/Sidebar'
import { NavBar } from './components/NavBar'
import { BoardProvider } from './context/BoardContext'
import { ActivityProvider } from './context/ActivityContext'
import { ActivitySidebar } from './components/ActivitySidebar'

// Definición del componente principal App de la aplicación.
function App () {
  // Desestructuración de los valores del contexto de la aplicación
  const { user, loading } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Mientras comprobamos si hay usuario o no, mostramos una pantalla de carga
  if (loading) return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-md rounded-[32px] border border-white/80 bg-white/95 backdrop-blur-xl shadow-[0_30px_80px_rgba(15,23,42,0.12)] p-10'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 shadow-inner'>
          <div className='h-10 w-10 rounded-full border-4 border-primary-300 border-t-transparent animate-spin' />
        </div>
        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-primary-700 mb-3'>Fayver</p>
        <h1 className='text-3xl font-extrabold text-slate-900 mb-3'>Iniciando sesión</h1>
        <p className='text-sm text-slate-500 mb-8'>Cargando Fayver, preparando tus tablones y tu espacio de trabajo.</p>
        <div className='space-y-3'>
          <div className='h-2 w-full overflow-hidden rounded-full bg-slate-200'>
            <div className='h-full w-1/2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse' />
          </div>
          <p className='text-xs uppercase tracking-[0.24em] text-slate-400'>Cargando tu espacio de trabajo</p>
        </div>
      </div>
    </div>
  )

  return (

    <BrowserRouter>
      {/* Si el usuario está logueado, muestra el Sidebar + NavBar + contenido */}
      {user ? (
        <ActivityProvider>
          <BoardProvider>
            <div className='flex h-screen bg-gray-50 overflow-hidden'>
              <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

              {/* Contenedor derecho: flex-col para poner la NavBar arriba y el contenido abajo */}
              <div className='flex-1 flex flex-col min-w-0'>
                {/* Renderizamos la barra de navegación aquí, arriba de las rutas */}
                <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

                <ActivitySidebar />

                {/* Contenedor principal de las páginas con scroll independiente */}
                <main className='flex-1 overflow-y-auto p-6'>
                  <Routes>
                    <Route path='/dashboard' element={<DashboardPage />}></Route>
                    <Route path='/board/:boardId' element={<BoardPage />}></Route>
                    {/* Si el usuario intenta ir a /login estando logueado, lo mandamos al dashboard */}
                    <Route path='/login' element={<Navigate to='/dashboard' replace />} />
                    <Route path='*' element={<Navigate to='/dashboard' replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          </BoardProvider>
        </ActivityProvider>
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
