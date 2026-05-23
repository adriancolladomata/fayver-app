import { createContext, useContext, useState, useCallback } from 'react'
import { getListsReq, createListReq, deleteListReq, updateListReq, reorderListsReq } from '../services/listService'
import { getTasksReq } from '../services/taskService'

// Creacion del contexto para las listas
const ListContext = createContext()

// Creación del hook personalizado para usar el contexto de las listas.
export const useLists = () => {
  // Creación del contexto para leer y usar el contexto. Si el contexto se usaa fuera de un ListProvider, lanzamos un error.
  const context = useContext(ListContext)
  if (!context) throw new Error('useLists debe usarse dentro de un ListProvider')
  // Devolvemos el contexto para que los componentes puedan usarlo.
  return context
}

// Creación del ListProvider, que es el componente que provee el contexto de las listas a toda la aplicación.
// children representa a toda la aplicacion, y boardId es el id del tablero actual, que se le pasa desde BoardPage.jsx
export const ListProvider = ({ children, boardId }) => {
  // Creación de la variabl de las listas
  const [lists, setLists] = useState([])
  // Creación de la variable de carga.
  const [loading, setLoading] = useState(true)

  // Función para cargar las listas del tablero actual, se llama al abrir la págin del tablero.
  // Se usa useCallBack para memorizar la función y evitar que se vuelva a crear en cada renderizado, evitado así bucles infinitos en useEffect de BoardPage.jsx
  const loadLists = useCallback(async () => {
    try {
      // Asignamos la carga como true para mostrar el mensaje de carga mientras se obtienen las listas y tareas.
      setLoading(true)
      // Llamamos a la funcion getListsReq e listService para obtener las listas del tablero actual.
      const listsData = await getListsReq(boardId)

      // Por cada lista obtenida, llamamos a getTasksReq para obtener las tareas de esa lista,
      // y devolvemos un nuevo objeto que incluye las tareas dentro de la lista.
      // Promise.all se asegura de que esperamos a que se resuelvan todas las promesas de las tareas antes de actualizar el estado de las listas.
      const listsWithTasks = await Promise.all(
        // Para cada lista, obtenemos sus tareas y las añadimos a la lista.
        listsData.map(async (list) => {
          try {
            // Llamamos a la función getTasksReq e taskService para obtener las tareas de la lista actual.
            const tasks = await getTasksReq(boardId, list.id)
            // Devolcemos un nuevo objeto que incluye las tareas dentro de la lista
            return { ...list, tasks }
          } catch (err) {
            // Si hay un error al obtener las tareas de una lista, mostramos el error de la consola y
            // devolvemos la lista sin tareas para que la aplicación siga funcionando.
            console.error(`Error cargando tareas de lista ${list.id}:`, err)
            return { ...list, tasks: [] }
          }
        })
      )

      // Actualizamos el estado de las listas con las tareas incluidas.
      setLists(listsWithTasks)
    } catch (err) {
      // Lanzamos un error en consola si algo falla
      console.error('Error al cargar las listas:', err)
    } finally {
      // Finalmente, indicamos que la carga ha finalizado
      setLoading(false)
    }
    // El array de dependencias incluye boardId para que, si el usuario cambia de tablero, se vuelvan a cargar
    // las listas del nuevo tablero.
  }, [boardId])

  // Función para crear una nueva lista en el tablero actual. Se llama desde ListForm.jsx
  const createList = useCallback(async (name, color = '#ffffff') => {
    try {
      // Llamamos a la función createListReq de listService para crear una nueva lista en el tablero actual, pasandole los parámetros correspondientes.
      const response = await createListReq(boardId, { name, color })
      // Feedback de éxito en la consola.
      console.log('Respuesta del servidor:', response)
      // Recargar todas las listas para obtener la nueva
      await loadLists()
      // Devolvemos la respuesta por si el componente que llama a createList quiere hacer algo con ella (como cerrar un modal o
      // mostrar un mnsaje de éxito))
      return response
    } catch (err) {
      console.error('Error completo al crear lista:', err)
      throw err
    }
    // El array de dependencias incluye boardId para que, si el usuario cambia de tablero, se pueda crear una lista en el
    // nuevo tablero, y loadLists para recargar las listas después de crear una nueva.
  }, [boardId, loadLists])

  // Función para eliminar una lista del tablero actual.
  const deleteList = useCallback(async (listId) => {
    try {
      // Llamada a la función de deleteListReq de listService para eliminar la lista.
      await deleteListReq(boardId, listId)
      // Actualizamos el estado de las listas eliminando la lista que hemos borrado, para actualizar la interfaz sin necesidad
      // de recargar todas las listas.
      setLists(prevLists => prevLists.filter(list => list.id !== listId))
    } catch (err) {
      console.error('Error al eliminar lista:', err)
      throw err
    }
    // El array de dependencias incluye boardId para que, si el usuario cambia de tablero, se pueda eliminar una lista del nuevo tablero.
  }, [boardId])

  const updateList = useCallback(async (listId, data) => {
    try {
      const response = await updateListReq(boardId, listId, data)
      // Si el cambio es archivar, la detectamos y filtramos al instante para actualizar
      if (data && data.is_archived === true) {
        setLists(prevLists => prevLists.filter(list => list.id !== listId))
      } else {
      // Para cualquier otro cambio (como el color o el nombre), mantiene tu lógica actual en memoria
        setLists(prevLists => prevLists.map(list =>
          list.id === listId ? { ...list, ...data } : list
        ))
      }
      return response
    } catch (err) {
      console.error('Error al actualizar la lista:', err)
      throw err
    }
  }, [boardId])

  const reorderLists = useCallback(async (listsOrder) => {
    try {
      const response = await reorderListsReq(boardId, listsOrder)
      await loadLists()
      return response
    } catch (err) {
      console.error('Error al reordenar las listas:', err)
      throw err
    }
  }, [boardId, loadLists])

  // Creamos el objeto value que incluye los datos y funciones que queremos compartir en el contexto.
  // En este caso, compartimos la lista de listas, el estado de carga, la función para cargar las listas,
  // la función para crear una nueva lista, la función para crear una nueva tarea, la función para eliminar una lista,
  // y la función para eliminar una tarea
  // Inyectamos las nuevas propiedades en el value compartido
  const value = {
    lists,
    setLists,
    loading,
    loadLists,
    createList,
    deleteList,
    updateList,
    reorderLists
  }

  // Devolvemos el ListContext.Provider con el valor del contexto y envolviendo a toda la aplicación (children)
  // para que todos los componentes puedan acceder a los datos y funciones del contexto.
  return <ListContext.Provider value={value}>{children}</ListContext.Provider>
}
