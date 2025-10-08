import express from 'express'
import { createTask, updateTask, deleteTask, getUserTasks, getTask, getProjectTasks } from '../controllers/taskControllers.js'
import { auth } from '../middlewares/authMiddleware.js'
import { isTaskCreator, canCreateTaskInProject, canAccessTask, canViewProjectTasks } from '../middlewares/taskMiddleware.js'

const router = express.Router()

router.post('/create', auth, canCreateTaskInProject, createTask)
router.delete('/delete', auth, isTaskCreator, deleteTask)
router.put('/update', auth, canCreateTaskInProject, updateTask)
router.get('/get', auth, getUserTasks)
router.get('/getAll', auth, canAccessTask, getTask)
router.get('/get/project/:projectId', auth, canViewProjectTasks, getProjectTasks)

export default router

