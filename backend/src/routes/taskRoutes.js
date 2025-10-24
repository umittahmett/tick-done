import express from 'express'
import { createTask, updateTask, deleteTask, getUserTasks, getTask, getAllProjectTasks } from '../controllers/taskControllers.js'
import { auth } from '../middlewares/authMiddleware.js'
import { canManageProjectTasks, canViewTask, canUpdateTask, canViewProjectTasks, canDeleteTask } from '../middlewares/taskMiddleware.js'
import { validate } from '../middlewares/validateMiddleware.js'
import { 
  createTaskSchema,
  deleteTaskSchema,
  getAllProjectTasksSchema,
  getTaskSchema,
  updateTaskSchema,
} from '../validation/task/index.js'

const router = express.Router()

router.post('/createTask/:projectId', auth, canManageProjectTasks, validate(createTaskSchema), createTask)
router.delete('/deleteTask/:taskId', auth, canDeleteTask, validate(deleteTaskSchema), deleteTask)
router.put('/updateTask/:taskId', auth, canUpdateTask, validate(updateTaskSchema), updateTask)
router.get('/getUserTasks', auth, getUserTasks)
router.get('/getTask/:taskId', auth, canViewTask, validate(getTaskSchema), getTask)
router.get('/getAllProjectTasks/:projectId', auth, canViewProjectTasks, validate(getAllProjectTasksSchema), getAllProjectTasks)

export default router

