
import * as taskServices from '../services/taskServices.js'

export async function getUserTasks(req, res) {
  try {
    const userId = req.user.id
    const data = await taskServices.getUserTasks({ userId })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function getProjectTasks(req, res) {
  try {
    const projectId = req.params.projectId
    const data = await taskServices.getProjectTasks({ projectId })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function getTask(req, res) {
  try {
    const { taskId } = req.params
    const data = await taskServices.getTask({ taskId })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function createTask(req, res) {
  try {
    const { title, description, priority, dueDate, assignments, projectId } = req.body
    const creator = req.user.id
    const data = await taskServices.createTask({ title, description, priority, dueDate, assignments, creator, projectId })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function updateTask(req, res) {
  try {
    const { taskId, ...updateFields } = req.body
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' })
    }
    
    const data = await taskServices.updateTask({ taskId, updateFields })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function deleteTask(req, res) {
  try {
    const { taskId } = req.body
    const data = await taskServices.deleteTask({ taskId })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}