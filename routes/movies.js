import { Router } from 'express'
import { validateMovie, validatePartialMovie } from '../schemas-validation/moviesSchema.js'
import { readJSON } from '../utils/utilsFunctions.js'
import { randomUUID } from 'node:crypto'

const moviesJSON = readJSON('../movies.json')
export const moviesRouter = Router()

moviesRouter.get('/', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*')
  const { genre } = req.query
  if (genre) {
    const filteredMovies = moviesJSON.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return res.json(filteredMovies)
  }
  res.json(moviesJSON)
})

moviesRouter.patch('/:id', (req, res) => {
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

moviesRouter.post('/', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    // puede ser un 422 tambien
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: randomUUID(),
    ...result.data
  }
  moviesJSON.push(newMovie)
  return res.status(201).json(newMovie)
})

moviesRouter.delete('/:id', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*')
  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(movie => movie.id === id)
  if (movieIndex < 0) return res.status(404).json({ message: 'movie not found' })
  const deletedMovie = moviesJSON.slice(movieIndex, 1)
  return res.status(200).json(deletedMovie)
})

moviesRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const movie = moviesJSON.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).send('<h1>404 not found</h1>')
})

// app.options('/movies/:id', (req, res) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT')
//   res.send()
// })
