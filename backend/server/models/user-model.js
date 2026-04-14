import { db } from "../database/db.js";

export class UserModel {
  static async findByEmail(email) {
    const rows = await db.query(
      "SELECT * FROM users WHERE email = ?", [email] // Se pasa por array por que puede haber mas de un valor, en este caso solo hay email
    ) 
    
    return rows[0] // mysql devuelve una lista, por lo que obtenemos el valor de esta manera
  }

  static async createUser(name, email, password) {
    await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?", [name, email, password]
    )
  }

}