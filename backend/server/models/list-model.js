import { db } from '../database/db.js'

class ListModel {
  static async createList (id, name, board_id, order) {
    await db.query('INSERT INTO list (id, name, board_id, \`order\`) VALUES (?, ?, ?, ?)',
      [id, name, board_id, order]
    )
  }

  // Función para reordenar las listas
  static async reorderLists (board_id, lists) {
    // Se pide una conexión exclusiva, que queda reservada para esta operación (Guardarse una conexion privada con la BD)
    const connection = await db.getConnection()

    // Try para que si falla la operación, se haga un rollback
    try {
      // MySQL empieza el modo transacción, los cambios no son definitivos, se guardan en memoria interna y no afectan todavia a la tabla, como un borrador
      await connection.beginTransaction()

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
}
