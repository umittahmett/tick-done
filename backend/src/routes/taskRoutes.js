import express from 'express'
import { createTask, updateTask, deleteTask, getUserTasks, getTask, getAllProjectTasks } from '../controllers/taskControllers.js'
import { auth } from '../middlewares/authMiddleware.js'
import { canManageProjectTasks, canViewTask, canUpdateTask, canViewProjectTasks } from '../middlewares/taskMiddleware.js'

const router = express.Router()

router.post('/createTask/:projectId', auth, canManageProjectTasks, createTask) //
router.delete('/deleteTask/:taskId', auth, canManageProjectTasks, deleteTask) //
router.put('/updateTask/:taskId', auth, canUpdateTask, updateTask) //
router.get('/getUserTasks/:projectId', auth, getUserTasks) //
router.get('/getTask/:taskId', auth, canViewTask, getTask) //
router.get('/getAllProjectTasks/:projectId', auth, canViewProjectTasks, getAllProjectTasks) //

export default router

