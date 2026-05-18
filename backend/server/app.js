import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth-routes.js'
import boardRoutes from './routes/board-routes.js'
import listRoutes from './routes/list-routes.js'
import taskRoutes from './routes/task-routes.js'
import commentRoutes from './routes/comment-routes.js'
import cors from 'cors'

const app = express()

app.disable('x-powered-by')

// Middlewares
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
  'http://localhost:5173',
  'https://fayver-app.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como herramientas de testeo o Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'El origen CORS para este sitio no está permitido.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Vital porque usamos cookies/sesiones (withCredentials: true)
}));

// Rutas
app.use('/auth', authRoutes)
app.use('/boards', boardRoutes)
app.use('/boards/:boardId/lists', listRoutes)
app.use('/boards/:boardId/lists/:listId/tasks', taskRoutes)
app.use('/boards/:boardId/lists/:listId/tasks/:taskId/comments', commentRoutes)


// Ruta raíz (opcional)
app.get('/', (req, res) => {
  res.send('Servidor iniciado')
})

export default app
