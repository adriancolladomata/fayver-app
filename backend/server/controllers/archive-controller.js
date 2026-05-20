import { ListModel } from '../models/list-model.js'

// GET /api/boards/:boardId/lists/action/archived
export const getArchivedElements = async (req, res) => {
  const { boardId } = req.params

  try {
    // Obtenemos los datos planos combinados de la base de datos
    const rows = await ListModel.getArchivedTree(boardId)

    // Agrupamos las tareas dentro de sus respectivas listas utilizando un Map
    const listsMap = new Map()

    for (const row of rows) {
      if (!listsMap.has(row.list_id)) {
        listsMap.set(row.list_id, {
          id: row.list_id,
          name: row.list_name,
          is_archived: Boolean(row.list_is_archived),
          tasks: []
        })
      }

      // Si la fila contiene una tarea asociada y esa tarea está archivada
      // (o la lista completa lo está), la añadimos al array de tareas de la lista
      if (row.task_id) {
        listsMap.get(row.list_id).tasks.push({
          id: row.task_id,
          list_id: row.list_id,
          name: row.task_name,
          is_archived: Boolean(row.task_is_archived)
        })
      }
    }

    // Convertimos el mapa de vuelta a un array clásico para la respuesta JSON
    const archiveTree = Array.from(listsMap.values())

    return res.status(200).json(archiveTree)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
