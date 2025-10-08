import express from 'express'
import { createTask, updateTask, deleteTask, getUserTasks, getTask, getProjectTasks } from '../controllers/taskControllers.js'
import { auth } from '../middlewares/authMiddleware.js'
import { isTaskCreator, canCreateTaskInProject, canAccessTask, canViewProjectTasks } from '../middlewares/taskMiddleware.js'

const router = express.Router()

router.post('/createTask', auth, canCreateTaskInProject, createTask)
router.delete('/deleteTask', auth, isTaskCreator, deleteTask)
router.put('/updateTask', auth, canCreateTaskInProject, updateTask)
router.get('/getUserTasks', auth, getUserTasks)
router.get('/getTask', auth, canAccessTask, getTask)
router.get('/getProjectTasks', auth, canViewProjectTasks, getProjectTasks)

export default router

