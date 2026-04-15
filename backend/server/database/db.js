import mysql from 'mysql2/promise'

//mysql.createPool() soporta mas usuarios, es más rapido y más estable que createConnection()
export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'fayver_db',
  password: 'root',
  waitForConnections: true,
  connectionLimit: 10
})

async function checkConnection () {
  try {
    const connection = await db.getConnection()
    console.log('Conexión con la base de datos exitosa.')
    connection.release()
  } catch (error) {
    console.error('Error al conectar la base de datos.', error.message)
  }
}

checkConnection()
