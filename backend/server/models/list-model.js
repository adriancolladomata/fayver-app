import { db } from '../database/db.js'

export class ListModel {
  // Funcion para crear una lista
  static async createList (id, name, board_id, order, color) {
    await db.query('INSERT INTO lists (id, name, board_id, \`order\`, color) VALUES (?, ?, ?, ?, ?)',
      [id, name, board_id, order, color]
    )
  }

  static async getLists (board_id) {
    const [rows] = await db.query('SELECT * FROM lists WHERE board_id = ? AND is_archived = 0 AND deleted_at IS NULL ORDER BY `order` ASC',
      [board_id]
    )

    return rows
  }


  static async getList (id, board_id) {
    const [rows] = await db.query('SELECT * FROM lists WHERE id = ? AND board_id = ? AND deleted_at IS NULL',
      [id, board_id]
    )

    return rows[0]
  }

  // Al ponerlo como objeto, no importa el orden en el que se introduzcan los datos, ideal para actualizaciones parciales,
  // como esta, que incluyen varios datos que se pueden actualizar.
  static async modifyList (id, board_id, { name, isShowed, order, color, is_archived }) {
    const [result] = await db.query(`UPDATE lists SET 
      name = COALESCE(?, name),
      color = COALESCE(?, color),
      \`order\` = COALESCE(?, \`order\`),
      is_showed = COALESCE(?, is_showed),
      is_archived = COALESCE(?, is_archived)
      WHERE id = ? AND board_id = ? AND deleted_at IS NULL`,
    [name ?? null, color ?? null, order ?? null, isShowed ?? null, is_archived  ?? null, id, board_id]
    )

    return result
  }

  // Función para obtener el numero de orden de la última lista del tablón
  static async getLastOrder (board_id) {
    // Query para seleccionar el elemento mayor de order de un determinado tablón
    const [rows] = await db.query('SELECT MAX(\`order\`) AS maxOrder FROM lists WHERE board_id = ? AND deleted_at IS NULL',
      [board_id]
    )

    // Devuelve el primer valor que obtiene, y si no hay, asignamos -1 para evitar un valor null, undefined, etc... y que se asigne un 0 e
    // la lista que será introducida en el controller
    return rows[0].maxOrder ?? -1
  }

  // Función para reordenar las listas
  static async reorderLists (board_id, lists) {
    // Se pide una conexión exclusiva, que queda reservada para esta operación (Guardarse una conexion privada con la BD)
    const connection = await db.getConnection()

    // Try para que si falla la operación, se haga un rollback
    try {
      // MySQL empieza el modo transacción, los cambios no son definitivos, se guardan en memoria interna y no afectan todavia a la tabla, como un borrador
      await connection.beginTransaction()

      // 1. PASO DE SEGURIDAD: Movemos todas las tareas de esta lista a números negativos
      // Esto "libera" los números 0, 1, 2, 3... para que no haya choques
      await connection.query(
        'UPDATE lists SET `order` = (`order` + 1) * -1 WHERE board_id = ?',
        [board_id]
      )

      // Se recorre el array obtenido como parámetro de la función
      for (const list of lists) {
        // Se actualiza el orden en cada lista mediante el UPDATE, pero aun no es definitivo, ya que aun no se guarda en la base de datos
        await connection.query('UPDATE lists SET \`order\` = ? WHERE id = ? AND board_id = ?',
          [list.order, list.id, board_id]
        )
      }

      // MySQL aplica todos los cambios de golpe
      await connection.commit()
    } catch (error) {
      // Si hay algún error en alguna query, entra aqui
      await connection.rollback()
      throw error
      // siempre se ejecuta, devuelve la conexión al pool
    } finally {
      connection.release()
    }
  }

  // Función para eliminar (parcialmente, modificando el deleted_at) una lista
  static async deleteList (id, board_id) {
    const [result] = await db.query ('UPDATE lists SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND board_id = ?',
      [id, board_id]
    )

    return result
  }

  static async getArchivedTree (boardId) {
  // Traemos las listas y sus tareas asociadas si la lista está archivada O la tarea está archivada
    const query = `
    SELECT 
      l.id AS list_id, 
      l.name AS list_name, 
      l.is_archived AS list_is_archived,
      t.id AS task_id, 
      t.name AS task_name
    FROM lists l
    LEFT JOIN tasks t ON l.id = t.list_id AND t.deleted_at IS NULL
    WHERE l.board_id = ? 
      AND l.deleted_at IS NULL
      AND l.is_archived = 1
    ORDER BY l.\`order\` ASC, t.\`order\` ASC
  `
    const [rows] = await db.query(query, [boardId])
    return rows
  }
}
