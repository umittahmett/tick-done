import User from '../models/User.js'
import Task from '../models/Task.js'
import dotenv from 'dotenv'
import { AppError } from '../utils/appError.js'

dotenv.config()

export async function getUserTasks(userId, projectId) {
  const tasks = await Task.find({
    project: projectId,
    assignments: userId
  })
  .populate('creator', '_id fullname title email')
  .populate('assignments', '_id fullname title email')
  
  return { tasks }
}

export async function getAllProjectTasks(projectId) {
  const tasks = await Task.find({
    project: projectId,
  })
  .populate('creator', '_id fullname title email')
  .populate('assignments', '_id fullname title email')
  
  return { tasks }
}

export async function getTask(taskId) {
  const task = await Task.findOne({ _id: taskId })
  .populate('creator', '_id fullname title email')
  .populate('assignments', '_id fullname title email')

  if(!task) throw new AppError('Task not found', 404)

  return { task }
}

export async function createTask({ title, description, priority, dueDate, assignments, creator, projectId }) {
  const user = await User.findOne({ _id: creator })
  if(!user) throw new AppError('User not found')
  
  if(assignments && assignments.length > 0) {
    const foundUsers = await User.find({ _id: { $in: assignments } })
    if(foundUsers.length !== assignments.length) {
      throw new AppError('Some assigned people not found')
    }
  }

  const task = new Task({ 
    title, 
    description, 
    priority, 
    dueDate, 
    assignments, 
    creator,
    project: projectId
  })
  await task.save()

  return { task }
}

export async function updateTask({ taskId, updateFields }) {
  const task = await Task.findOne({ _id: taskId })
  if(!task) throw new AppError('Task not found', 404)

  const allowedFields = ['title', 'description', 'priority', 'dueDate', 'status']
  allowedFields.forEach(field => {
    if(updateFields[field] !== undefined) {
      task[field] = updateFields[field]
    }
  })

  await task.save()

  return { task }
}

export async function deleteTask(taskId) {
  const task = await Task.findOne({ _id: taskId })
  if(!task) throw new AppError('Task not found', 404)

  await task.deleteOne()

  return { task }
}