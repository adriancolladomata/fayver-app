import { db } from '../database/db.js'

export class TaskModel {
  static async createTask (taskId, listId, name, order) {
    await db.query('INSERT INTO tasks (id, list_id, name, \`order\`) VALUES (?, ?, ?, ?)',
      [taskId, listId, name, order]
    )
  }

  static async getTask (taskId, listId) {
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ? AND list_id = ?',
      [taskId, listId])

    return rows[0]
  }

  static async getTasks (listId) {
    const [rows] = await db.query('SELECT * FROM tasks WHERE list_id = ?',
      [listId]
    )

    return rows
  }

  // Función para obtener el numero de orden de la última lista del tablón
  static async getLastOrder (listId) {
    // Query para seleccionar el elemento mayor de order de un determinado tablón
    const [rows] = await db.query('SELECT MAX(\`order\`) AS maxOrder FROM tasks WHERE list_id = ? AND deleted_at IS NULL',
      [listId]
    )

    // Devuelve el primer valor que obtiene, y si no hay, asignamos -1 para evitar un valor null, undefined, etc... y que se asigne un 0 e
    // la lista que será introducida en el controller
    return rows[0].maxOrder ?? -1
  }
}



