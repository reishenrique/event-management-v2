import mongoose from 'mongoose'
import { app } from '../src/app'
import 'dotenv/config'

const port = process.env.PORT || 3000
const stringConnection = process.env.DATABASE_CONNECTION as string

const connectDatabase = async () => {
  const mongooseConnection = await mongoose.connect(stringConnection)
  if (mongooseConnection) {
    app.listen(port, () => {
      console.log(`MongoDB Connected / Server running on port: ${port}`)
    })
  }

  return mongooseConnection
}

connectDatabase()
