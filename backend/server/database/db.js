import mysql from 'mysql2/promise'

//mysql.createPool() soporta mas usuarios, es más rapido y más estable que createConnection()
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
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
