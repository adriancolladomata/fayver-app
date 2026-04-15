import express from 'express'
import { PORT } from '../config.js'

const app = express()

app.use('/', (req, res) => {
  res.send('Server started.')
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
