import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  // 🎯 El estado ahora vive en el padre común
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden'>
      {/* Pasamos el estado y la función para cerrar a la Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Contenedor del contenido principal (Navbar + Páginas) */}
      <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
        {/* Pasamos el estado y la función para abrir a la Navbar */}
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Contenido de la página actual (Tableros, Dashboard, etc.) */}
        <main className='flex-1 overflow-auto p-8 relative'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
