import { db } from '../database/db.js'

export class BoardModel {
  static async createBoard (id, name, owner_id, share_token) {
    await db.query('INSERT INTO boards (id, name, owner_id, share_token) VALUES (?, ?, ?, ?)',
      [id, name, owner_id, share_token])
  }

  static async getBoards (owner_id) {
    const [rows] = await db.query('SELECT * FROM boards WHERE owner_id = ? AND deleted_at IS NULL',
      [owner_id]
    );

    return rows;
  }

  static async getBoard (id, owner_id) {
    const [rows] = await db.query('SELECT * FROM boards WHERE id = ? AND owner_id = ?',
      [id, owner_id]
    )

    return rows[0]
  }

  static async updateBoard (id, name, owner_id) {
    const [result] = await db.query('UPDATE boards SET name = ? WHERE id = ? AND owner_id = ? AND deleted_at IS NULL',
      [name, id, owner_id]
    )

    return result
  }

  static async deleteBoard (id, owner_id)  {
    const [result] = await db.query(
      // No se coloca el filtro deleted_at IS NULL para manejar el error en el Controller
      'UPDATE boards SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND owner_id = ?',
      [id, owner_id]
    )

    return result
  }
}
