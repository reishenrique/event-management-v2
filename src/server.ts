import mongoose from 'mongoose'
import { app } from '../src/app'
import 'dotenv/config'

const port = process.env.PORT || 3000
const stringConnection = process.env.DATABASE_CONNECTION as string

async function connectDatabase() {
  const mongooseConnection = mongoose
    .connect(stringConnection)
    .then(() => {
      app.listen(port, () => {
        console.log(`MongoDB Connected / Server running on port: ${port}`)
      })
    })
    .catch((error: Error) => console.log(error))

  return mongooseConnection
}

connectDatabase()
