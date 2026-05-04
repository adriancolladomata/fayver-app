import { db } from '../database/db.js'

export class CommentModal {
  static async createComment (id, taskId, userId, content) {
    await db.query('INSERT INTO task_comments (id, task_id, user_id, content) VALUES (?, ?, ?, ?)',
      [id, taskId, userId, content]
    )
  }

  static async getComment (id, taskId) {
    const [rows] = await db.query('SELECT * FROM task_comments WHERE id = ? AND task_id = ?',
      [id, taskId]
    )

    return rows[0]
  }

  static async getComments (taskId) {
    const [rows] = await db.query('SELECT * FROM task_comments WHERE task_id = ?',
      [taskId]
    )

    return rows
  }
}
