import express from 'express'

const PORT = process.env.PORT ?? 3000

const app = express()

app.use('/', (req, res) => {
  res.send('Server started.')
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})