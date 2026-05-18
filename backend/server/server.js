import app from './app.js'
import { PORT } from '../config.js'
import 'dotenv/config' // Esto lee tu archivo .env antes de que se monte el pool

console.log('Valores detectados:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
