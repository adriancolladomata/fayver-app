import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth-routes.js'
import boardRoutes from './routes/board-routes.js'
import listRoutes from './routes/list-routes.js'

const app = express()

app.disable('x-powered-by')

// Middlewares
app.use(express.json())
app.use(cookieParser())

// Rutas
app.use('/auth', authRoutes)
app.use('/boards', boardRoutes)
app.use('/lists', listRoutes)

// Ruta raíz (opcional)
app.get('/', (req, res) => {
  res.send('Servidor iniciado')
})

export default app
