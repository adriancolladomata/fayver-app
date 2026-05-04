import { db } from '../database/db.js';
import { randomUUID } from 'node:crypto'

export class UserModel {
  static async findByEmail (email) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?', [email] // Se pasa por array por que puede haber mas de un valor, en este caso solo hay email
    )
    return rows[0] // mysql devuelve una lista, por lo que obtenemos el valor de esta manera
  }

  static async createUser (name, email, password) {
    const id = randomUUID()

    await db.query(
      'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)', [id, name, email, password]
    )

    return id
  }

  static async getUserById (id) {
    const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?',
      [id]
    )

    return rows[0]
  }

}
