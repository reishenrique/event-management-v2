import mongoose from 'mongoose'
import { env } from '../src/database/env'
import { app } from '../src/app'

const port = env.PORT || 3001

mongoose
  .connect(env.DABASE_CONNECTION)
  .then(() => {
    app.listen(port, () => {
      console.log(`MongoDB Connected / Server running on port: ${port}`)
    })
  })
  .catch((error: Error) => console.log(error))
