import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'
// como leer un json en ESModules
// import fs from 'node:fs'
// const moviesJSON = JSON.parse(fs.readFileSync('./movies.json'))

const app = express()

app.use(json())

// accepted_origins, list all the ips that will have access to the api,
// this also includes the server itself, !origin indicates that its the sv the ip origin of the rq
// the wbrowser dont include a cors header for request from the sv.
app.use(corsMiddleware())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

app.use('/movies', moviesRouter)

app.use((req, res) => {
  res.end('<h1>404 not found</h1>')
})

const PORT = process.env.PORT ?? 8081

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}, http://localhost:${PORT}`)
})
