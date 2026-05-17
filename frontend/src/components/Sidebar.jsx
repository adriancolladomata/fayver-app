import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBoardsReq } from '../services/boardService.js'
import { CreateBoardModal } from './CreateBoardModal.jsx'
import { useBoards } from '../context/BoardContext.jsx'
import { FayverFlowLogo } from '../assets/fayver.jsx'

export const Sidebar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { boards, loading } = useBoards()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null) // Guarda el ID del tablón con menú abierto
  const menuRef = useRef(null)

  // Cerrar el menú si haces clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className='w-64 bg-neutral-900 text-white h-screen flex flex-col'>
      {/* Logo y título */}
      <div className='pl-6 pr-6 pb-6 pt-3.5 border-b border-gray-800'>
        <div className='flex items-center -ml-1.5'>
          <FayverFlowLogo className='w-9 h-9' />
          <h1 className='text-xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 bg-clip-text text-transparent'>Fayver</h1>
        </div>
        <p className='text-xs text-gray-400'>Diseña. Gestiona. Simplifica.</p>
        <div onClick={() => navigate('/dashboard')} className='mt-2 bg-gradient-to-r from-blue-700 to-blue-500
          hover:from-blue-800 hover:to-blue-600 flex rounded-xl w-20 h-8 justify-center items-center gap-1 cursor-pointer'
        >
          <img src='../SVG Home.svg' alt='Icono Casa' className='w-5 h-5 invert' />
          <span className='text-sm'>Inicio</span>
        </div>
      </div>

      {/* Botón Nuevo Tablón */}
      <div className='p-4'>
        {/* 4. Al hacer clic, cambiamos el estado a true para abrir el modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className='w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer'
        >
          <span>+</span>
          <span>Nuevo Tablón</span>
        </button>
      </div>

      {/* Sección de Tablones */}
      <div className='flex-1 overflow-y-auto px-4'>
        <h2 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2'>Tus Tablones</h2>
        {loading ? (
          <p className='text-sm text-gray-400 px-2'>Cargando...</p>
        ) : boards.length > 0 ? (
          <nav className='space-y-1'>
            {boards.map(board => (
              <button
                key={board.id}
                onClick={() => navigate(`/board/${board.id}`)}
                className='w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm truncate cursor-pointer'
                title={board.name}
              >
                {board.name}
              </button>
            ))}
          </nav>
        ) : (
          <p className='text-sm text-gray-400 px-2'>No tienes tablones aún</p>
        )}
      </div>

      {/* Footer */}
      <div className='p-4 border-t flex justify-center border-gray-800'>
        <button onClick={handleLogout} className='hover:bg-neutral-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer'>
          Cerrar Sesión
        </button>
      </div>

      {/* 5. Insertamos el Modal y le pasamos las props que necesita */}
      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
