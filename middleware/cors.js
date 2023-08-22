import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8081'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})

// pre flight needed for more patch, update delete, put
// app.options('/movies/:id', (req, res) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT')
//   res.send()
// })
