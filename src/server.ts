import mongoose from 'mongoose'
import express from 'express'
import { env } from '../src/database/env'
import routes from './routes'

const app = express()
const port = env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(routes)

mongoose
  .connect(env.DATABASE_CONNECTION as string)
  .then(() => {
    app.listen(port, () => {
      console.log(`MongoDB Connected / Server running on port: ${port}`)
    })
  })
  .catch((error: Error) => console.log(error))
