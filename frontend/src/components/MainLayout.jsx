import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { NavBar } from './Navbar'
import { Outlet } from 'react-router-dom'
import { ActivitySidebar } from './ActivitySidebar'
import { ActivityProvider } from '../context/ActivityContext'

export const MainLayout = () => {
  // 🎯 El estado ahora vive en el padre común
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <ActivityProvider>
      <div className='flex h-screen bg-gray-50 overflow-hidden relative'>
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
          <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

          <main className='flex-1 overflow-auto p-8 relative'>
            <Outlet />
          </main>
        </div>

        {/* La Sidebar está globalmente por encima de todas las páginas */}
        <ActivitySidebar />
      </div>
    </ActivityProvider>
  )
}
