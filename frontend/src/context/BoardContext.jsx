import { createContext, useContext, useState, useEffect } from 'react'
import { getBoardsReq, createBoardReq } from '../services/boardService'

const BoardContext = createContext()

export const useBoards = () => {
  const context = useContext(BoardContext)
  if (!context) throw new Error ('useBoards debe usarse dentro de un BoardProvider')
  return context
}

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    loadBoards()
  }, [])

  const createBoard = async (name) => {
    try {
      const newBoard = await createBoardReq({ name })
      // Actualizamos el estado global: todos los que usen este contexto lo verán
      setBoards((prev) => [...prev, newBoard])
      return newBoard
    } catch (error) {
      console.error('Error al crear el tablón: ', error)
      throw error
    }
  }

  return (
    <BoardContext.Provider value={{ boards, loading, createBoard, loadBoards }}>
      {children}
    </BoardContext.Provider>
  )
}
