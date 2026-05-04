import { db } from '../database/db.js'

export class CommentModal {
  static async createComment (id, taskId, userId, content) {
    await db.query('INSERT INTO task_comments (id, task_id, user_id, content) VALUES (?, ?, ?, ?)',
      [id, taskId, userId, content]
    )
  }

  static async getComment (id, taskId) {
    const [rows] = await db.query('SELECT * FROM task_comments WHERE id = ? AND task_id = ? AND deleted_at IS NULL',
      [id, taskId]
    )

    return rows[0]
  }

  static async getComments (taskId) {
    const [rows] = await db.query('SELECT * FROM task_comments WHERE task_id = ? AND deleted_at IS NULL',
      [taskId]
    )

    return rows
  }

  static async updateComment (id, taskId, content) {
    // Usamos COALESCE para que, en caso de que no se cambie, no de ningun error.
    const [result] = await db.query('UPDATE task_comments SET content = COALESCE(?, content) WHERE id = ? AND task_id = ? AND deleted_at IS NULL',
      [content, id, taskId]
    )

    return result
  }

  static async deleteComment (id, taskId) {
    const [result] = await db.query('UPDATE task_comments SET deleted_at = CURRENT_TIMESTAMP where id = ? AND task_id = ? AND deleted_at IS NULL',
      [id, taskId])

    return result
  }
}
