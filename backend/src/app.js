import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import { connectDB } from "./config/db.js"
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler.js'
import rateLimit from 'express-rate-limit'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true 
}))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: {message: 'Too many requests from this IP, please try again later'}
})

const authApiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 50,
  message: {message: 'Too many requests from this IP, please try again later'}
})

app.use('/api/auth', authApiLimiter, authRoutes)
app.use('/api/tasks', apiLimiter, taskRoutes)
app.use('/api/projects', apiLimiter, projectRoutes)
app.use('/api/notifications', apiLimiter, notificationRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API running ✅' })
})

app.use(errorHandler)

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
  })
})

export default app
