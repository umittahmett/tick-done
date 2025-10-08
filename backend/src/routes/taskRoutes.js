import express from 'express'
import { createTask, updateTask, deleteTask, getTask } from '../controllers/taskControllers.js'
import { auth } from '../middlewares/authMiddleware.js'
import { isTaskCreator, canAccessTask, canCreateTaskInProject } from '../middlewares/taskMiddleware.js'

const router = express.Router()

router.post('/create', auth, canCreateTaskInProject, createTask)
router.delete('/delete', auth, isTaskCreator, deleteTask)
router.put('/update', auth, canCreateTaskInProject, updateTask)
router.get('/get', auth, canAccessTask, getTask)

export default router

