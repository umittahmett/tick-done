import User from '../models/User.js'
import Task from '../models/Task.js'
import dotenv from 'dotenv'

dotenv.config()

export async function getTask({ taskId }) {
  const task = await Task.findOne({ _id: taskId })
  if(!task) throw new Error('Task not found')

  return { task }
}

export async function createTask({ title, description, status, priority, dueDate, assignments, creator }) {
  const user = await User.findOne({ _id: creator })
  if(!user) throw new Error('User not found')
  
  if(assignments && assignments.length > 0) {
    const foundUsers = await User.find({ _id: { $in: assignments } })
    if(foundUsers.length !== assignments.length) {
      throw new Error('Some assigned people not found')
    }
  }

  const task = new Task({ title, description, status, priority, dueDate, assignments, creator })
  await task.save()

  return { task }
}

export async function updateTask({ taskId, updateFields }) {
  const task = await Task.findOne({ _id: taskId })
  if(!task) throw new Error('Task not found')

  if(updateFields.assignments && updateFields.assignments.length > 0) {
    const foundUsers = await User.find({ _id: { $in: updateFields.assignments } })
    if(foundUsers.length !== updateFields.assignments.length) {
      throw new Error('Some assigned people not found')
    }
  }

  Object.keys(updateFields).forEach(key => {
    if(updateFields[key] !== undefined) {
      task[key] = updateFields[key]
    }
  })

  await task.save()

  return { task }
}

export async function deleteTask({ taskId }) {
  const task = await Task.findOne({ _id: taskId })
  if(!task) throw new Error('Task not found')

  await task.deleteOne()

  return { task }
}