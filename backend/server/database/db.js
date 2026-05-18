import mysql from 'mysql2/promise'
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../../config.js' 

export const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: parseInt(DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10
})

async function checkConnection () {
  try {
    const connection = await db.getConnection()
    console.log('🟢 ¡Conexión con la base de datos de Aiven exitosa!')
    connection.release()
  } catch (error) {
    console.error('🔴 Error al conectar la base de datos.', error.message)
  }
}

checkConnection()
