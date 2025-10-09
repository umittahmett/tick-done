import User from '../models/User.js'
import Task from '../models/Task.js'
import dotenv from 'dotenv'

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

  if(!task) throw new Error('Task not found')

  return { task }
}

export async function createTask({ title, description, priority, dueDate, assignments, creator, projectId }) {
  const user = await User.findOne({ _id: creator })
  if(!user) throw new Error('User not found')
  
  if(assignments && assignments.length > 0) {
    const foundUsers = await User.find({ _id: { $in: assignments } })
    if(foundUsers.length !== assignments.length) {
      throw new Error('Some assigned people not found')
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
  if(!task) throw new Error('Task not found')

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
  if(!task) throw new Error('Task not found')

  await task.deleteOne()

  return { task }
}