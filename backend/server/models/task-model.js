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

  // Al igual que en las listas, usamos un objeto para desestructurar los campos.
  // Esto permite que desde el controller solo pases lo que quieres cambiar.
  static async modifyTask (id, list_id, { name, content, order, color, label, status, is_archived }) {
    const [result] = await db.query(`UPDATE tasks SET 
      name = COALESCE(?, name),
      content = COALESCE(?, content),
      \`order\` = COALESCE(?, \`order\`),
      color = COALESCE(?, color),
      label = COALESCE(?, label),
      status = COALESCE(?, status),
      is_archived = COALESCE(?, is_archived)
      WHERE id = ? AND list_id = ? AND deleted_at IS NULL`,
    [
      name ?? null, content ?? null, order ?? null, color ?? null, label ?? null, status ?? null, is_archived ?? null,
      id, list_id
    ])

    return result
  }

  // Reordenamiento de tareas mediante transacciones (indispensable para Drag & Drop)
  // Se usa el mismo sistema que en el reorder de las listas
  static async reorderTasks (list_id, tasks) {
    const connection = await db.getConnection()

    try {
      await connection.beginTransaction()

      // PASO DE SEGURIDAD: Movemos todas las tareas de esta lista a números negativos
      // Esto libera los números 0, 1, 2, 3... para que no haya choques
      await connection.query(
        'UPDATE tasks SET `order` = (`order` + 1) * -1 WHERE list_id = ?',
        [list_id]
      )

      for (const task of tasks) {
        await connection.query(
          'UPDATE tasks SET `order` = ? WHERE id = ? AND list_id = ?',
          [task.order, task.id, list_id]
        )
      }

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  // Función para eliminar (parcialmente, modificando el deleted_at) una tarea
  static async deleteTask (taskId, listId) {
    const [result] = await db.query ('UPDATE tasks SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND list_id = ?',
      [taskId, listId]
    )

    return result
  }
}



