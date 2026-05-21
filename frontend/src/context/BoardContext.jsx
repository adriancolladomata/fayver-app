import { createContext, useContext, useState, useEffect } from 'react'
import { getBoardsReq, createBoardReq, updateBoardReq, deleteBoardReq } from '../services/boardService'
import { useActivity } from './ActivityContext'
import { getActivityMessage } from '../utils/activityLogs'

// Instancia del contexto, el cual luego se usará para compartir datos en otros archivos.
const BoardContext = createContext()

// Hook para usar el contexto de los tablones (Custom hook)
export const useBoards = () => {
  // Instancia de useContext para leer el contexto. Si no hay BoardProvider por encima, lanzamos un error para avisar al desarrollador.
  const context = useContext(BoardContext)
  // Si no hay contexto, es por que se está llamando a useBoard fuera de un BoardProvider, por lo que lanzamos un error
  if (!context) throw new Error ('useBoards debe usarse dentro de un BoardProvider')
  // Devolvemos el contexto para que los componentes puedan usarlo.
  // El contexto incluye la lista de tableros, la función para crear un nuevo tablero, y el estado de carga.
  return context
}

// Componente que provee el contexto de los tableros a toda la aplicación. Envuelve a toda la app en App.jsx
export const BoardProvider = ({ children }) => {
  // Instancia de boards y loading para guardar la lista de tableros y el estado de carga.
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentBoard, setCurrentBoard] = useState(null)
  const { logActivity } = useActivity()

  // Función para cargar los tableros desde el backend. Se llama al abrir la página para mostrar los tableros del usuario.
  const loadBoards = async () => {
    try {
      // LLamamos a la función del boardService que hace la petición al backend para obtener los tableros del usuario.
      const res = await getBoardsReq()
      // Guardamos los tableros en la variable boards usando setBoards.
      setBoards(res)
    } catch (error) {
      // En caso de error mostramos dicho error en consola.
      console.error('Error al cargar los tablones: ', error)
    } finally {
      // Indicamos que la carga ha terminado, para que la app deje de mostrar el mensaje de cargaa correspondiente.
      setLoading(false)
    }
  }

  // useEffect para cargar los tableros al abrir la página. Solo se ejecuta una vez al cargar la pagina gracias al array de dependencias vacío,
  useEffect(() => {
    loadBoards()
  }, [])

  // Función para crear un nuevo tablero.
  const createBoard = async (boardData) => {
    try {
      // Llamamos al servicio: api.post('/boards', boardData)
      const newBoard = await createBoardReq(boardData)

      // Sincronizamos el estado de React
      setBoards(prev => [...prev, newBoard])

      // Registramos en el historial
      logActivity(getActivityMessage('BOARD_CREATE', {
        boardName: newBoard.name
      }))

      return newBoard
    } catch (error) {
      console.error('Error al crear el tablón:', error)
      throw error // Re-lanzamos para que el modal/componente pueda manejar el error visual
    }
  }

  // Función paa actualizar el tablón
  const updateBoard = async (boardId, newName) => {
    try {
      // Localizamos el nombre viejo antes de pisarlo para el historial
      const boardToUpdate = boards.find(b => b.id === boardId)
      const oldName = boardToUpdate ? boardToUpdate.name : 'Tablón'

      // Llamamos a tu servicio: api.put(`/boards/${boardId}`, { name: "..." })
      const updatedBoard = await updateBoardReq(boardId, { name: newName })

      // Sincronizamos la lista global de tablones
      setBoards(prev => prev.map(b => b.id === boardId ? updatedBoard : b))

      // Si el usuario está metido dentro de ese tablón, actualizamos la info de la cabecera
      if (currentBoard && currentBoard.id === boardId) {
        setCurrentBoard(updatedBoard)
      }

      // Registramos en el historial
      logActivity(getActivityMessage('BOARD_RENAME', {
        oldBoardName: oldName,
        newBoardName: newName
      }))

      return updatedBoard
    } catch (error) {
      console.error('Error al renombrar el tablón:', error)
      throw error
    }
  }

  const deleteBoard = async (boardId) => {
    try {
    // Buscamos el tablón en el estado actual para rescatar su nombre para el historial
      const boardToDelete = boards.find(board => board.id === boardId)
      const boardName = boardToDelete ? boardToDelete.name : 'Tablón sin nombre'

      // Hacemos la petición de borrar el tablón al backend
      const res = await deleteBoardReq(boardId)

      // Registramos la actividad en el historial antes de limpiar el estado del cliente
      logActivity(getActivityMessage('BOARD_DELETE', {
        boardName: boardName
      }))

      // Actualizamos el estado en local para que se muestre al instante filtrando todos
      // los tablones que no coincidan con el id proporcionado
      setBoards(previousBoards => previousBoards.filter(board => board.id !== boardId))
    } catch (error) {
      console.error('Error al borrar el tablón:', error)
      throw error
    }
  }

  // Devolvemos el contexto con los datos y funciones que queremos compartir de la aplicación.
  // En este caso, compartimos la lista de tableros, el estado de carga, la funcion para crear un nuevo tablero y la función para cargr los tableros.
  return (
    <BoardContext.Provider value={{ boards, loading, createBoard, loadBoards, updateBoard, deleteBoard, currentBoard, setCurrentBoard }}>
      {children}
    </BoardContext.Provider>
  )
}
