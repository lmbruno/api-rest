import { readJSON } from '../utils/utilsFunctions.js'
import { randomUUID } from 'node:crypto'
const moviesJSON = readJSON('../movies.json')

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      return moviesJSON.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }
    return moviesJSON
  }

  static async getById ({ id }) {
    const movie = moviesJSON.find(movie => movie.id === id)
    return movie
  }

  static async create ({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }
    moviesJSON.push(newMovie)
    return newMovie
  }

  static async delete ({ id }) {
    const movieIndex = moviesJSON.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false
    moviesJSON.splice(movieIndex, 1)
    return true
  }

  static async update ({ id, input }) {
    const movieIndex = moviesJSON.findIndex(movie => movie.id === id)

    if (movieIndex < 0) return false

    const updateMovie = {
      ...moviesJSON[movieIndex],
      ...input
    }

    moviesJSON[movieIndex] = updateMovie

    return updateMovie
  }
}
