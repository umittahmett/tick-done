import express from 'express'
import { createTask, updateTask, deleteTask, getTask } from '../controllers/taskControllers.js'
import { auth } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Tüm task route'ları için auth middleware gerekli
router.post('/create', auth, createTask)
router.delete('/delete', auth, deleteTask)
router.put('/update', auth, updateTask)
router.get('/get', auth, getTask)

export default router
