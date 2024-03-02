import express, { Express } from 'express'
import eventRoutes from './routes/eventRoute/eventRoutes'
import userRoutes from './routes/userRoute/userRoutes'
import authRoutes from './routes/authRoute/authRoutes'

export const app: Express = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v2', eventRoutes)
app.use('/api/v2', userRoutes)
app.use('/api/v2', authRoutes)
