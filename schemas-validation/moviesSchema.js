import zod from 'zod'

const movieSchema = zod.object({
  title: zod.string({
    required_error: 'title is required'
  }),
  year: zod.number().int().min(1900).max(2023),
  director: zod.string(),
  duration: zod.number().int().positive(),
  poster: zod.string().url({
    message: 'poster must be a valid URL'
  }),
  rate: zod.number().min(0).max(10).default(5.5),
  genre: zod.array(
    zod.enum(['Action', 'Adventure', 'Sci-Fi', 'Crime', 'Drama', 'Kids', 'Romance', 'Animation', 'Fantasy', 'Biography']),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be a valid genre option'
    }
  )
})

export function validateMovie (object) {
  return movieSchema.safeParse(object)
}
export function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}
