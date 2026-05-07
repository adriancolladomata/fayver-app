import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBoardsReq } from '../services/boardService.js'

export const Sidebar = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const res = await getBoardsReq()
        setBoards(res)
      } catch (error) {
        console.error('Error al cargar los tablones: ', error)
      } finally {
        setLoading(false)
      }
    }

    loadBoards()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className='w-64 bg-gray-900 text-white h-screen flex flex-col'>
      {/* Logo y título del proyecto */}
      <div className='p-6 border-b border-gray-800'>
        <h1 className='text-2xl font-bold text-blue-400'>Fayver</h1>
        <p className='text-sm text-gray-400 mt-1'>Bienvenido, <strong>{user?.name}</strong></p>
        <div onClick={() => navigate('/dashboard')} className='mt-2 bg-blue-600 flex rounded-xl w-20 h-8 justify-center items-center gap-1 cursor-pointer'>
          <img src='../SVG Home.svg' alt='Icono Casa' className='w-5 h-5 invert' ></img>
          <span className=''>Inicio</span>
        </div>

      </div>

      {/* Botón Nuevo Tablón */}
      <div className='p-4'>
        <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer'>
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

      {/* Footer con opción de logout */}
      <div className='p-4 border-t border-gray-800'>
        <button
          onClick={handleLogout}
          className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer'
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
