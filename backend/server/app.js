import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth-routes.js'

const app = express()

app.disable('x-powered-by')

// Middlewares
app.use(express.json())
app.use(cookieParser())

// Rutas
app.use('/auth', authRoutes)

// Ruta raíz (opcional)
app.get('/', (req, res) => {
  res.send('Servidor iniciado')
})

app.get('/test', (req, res) => {
  res.json({ ok: true })
})

export default app
