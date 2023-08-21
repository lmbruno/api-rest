const express = require('express')
const moviesJSON = require('./movies.json')
const crypto = require('node:crypto')
const cors = require('cors')

const { validateMovie, validatePartialMovie } = require('./schemas-validation/moviesSchema')

const app = express()

app.use(express.json())

// accepted_origins, list all the ips that will have access to the api,
// this also includes the server itself, !origin indicates that its the sv the ip origin of the rq
// the wbrowser dont include a cors header for request from the sv.

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8081'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

app.get('/movies', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*')
  const { genre } = req.query
  if (genre) {
    const filteredMovies = moviesJSON.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return res.json(filteredMovies)
  }
  res.json(moviesJSON)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)
  if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(movie => movie.id === id)

  if (movieIndex < 0) return res.status(404).json({ message: 'movie not found' })

  const updateMovie = {
    ...moviesJSON[movieIndex],
    ...result.data
  }

  moviesJSON[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    // puede ser un 422 tambien
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  moviesJSON.push(newMovie)
  return res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*')
  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(movie => movie.id === id)
  if (movieIndex < 0) return res.status(404).json({ message: 'movie not found' })
  const deletedMovie = moviesJSON.slice(movieIndex, 1)
  return res.status(200).json(deletedMovie)
})

// app.options('/movies/:id', (req, res) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT')
//   res.send()
// })

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = moviesJSON.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).send('<h1>404 not found</h1>')
})

app.use((req, res) => {
  res.end('<h1>404 not found</h1>')
})

const PORT = process.env.PORT ?? 8081

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}, http://localhost:${PORT}`)
})
