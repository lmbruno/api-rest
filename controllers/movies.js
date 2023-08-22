import { MovieModel } from '../models/movies.js'
import { validateMovie, validatePartialMovie } from '../schemas-validation/moviesSchema.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    // que es lo que renderiza
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).send('<h1>404 not found</h1>')
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (result.error) {
      // puede ser un 422 tambien
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const movie = await MovieModel.create({ input: result.data })
    return res.status(201).json(movie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const isMovieDeleted = await MovieModel.delete({ id })
    if (!isMovieDeleted) return res.status(404).json({ message: 'movie not found' })

    return res.status(200).json({ message: 'Movie deleted' })
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const { id } = req.params
    const updateMovie = await MovieModel.update({ id, input: result.data })
    if (updateMovie) return res.json(updateMovie)
    else return res.status(404).json({ message: 'Movie not found' })
  }
}
