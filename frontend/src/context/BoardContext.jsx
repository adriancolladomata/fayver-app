import { createContext, useContext, useState, useEffect } from 'react'
import { getBoardsReq, createBoardReq, updateBoardReq, deleteBoardReq } from '../services/boardService'

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
  const createBoard = async (name) => {
    try {
      // Llmamos a la función del boardService que hace la petición al backend para crear un nuevo tablero, donde se le pasa el nombre del tablero.
      const newBoard = await createBoardReq({ name })
      // Actualizamos el estado global: todos los que usen este contexto lo verán
      setBoards((prev) => [...prev, newBoard])
      return newBoard
    } catch (error) {
      // En caso de que salga mal, lanzamos un error en consola.
      console.error('Error al crear el tablón: ', error)
      throw error
    }
  }

  // Función paa actualizar el tablón
  const updateBoard = async (boardId, newName) => {
    try {
      // Petición para actualizar el tablón al backend
      const res = await updateBoardReq(boardId, { name: newName })

      // Actualizamos el estado local para que cambie visualmente en el momento
      setBoards(previousBoards => previousBoards.map(
        board => board.id === boardId ? { ...board, name: newName } : board
      ))

      if (currentBoard?.id === boardId) {
        setCurrentBoard(prev => ({ ...prev, name: newName }))
      }

      // Devolvemos la respuesta
      return res
    } catch (error) {
      console.error('Error al actualizar el tablón:', error)
      throw error
    }
  }

  const deleteBoard = async (boardId) => {
    try {
      // Hacemos la petición de borrar el tablón al backend
      const res = await deleteBoardReq(boardId)

      // Actualizamos el estaid en local para qu se muestre al instante filtrando todos
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
