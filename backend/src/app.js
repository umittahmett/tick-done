import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import { connectDB } from "./config/db.js"
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())


app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/projects', projectRoutes)

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
