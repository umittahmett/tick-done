
import * as taskServices from '../services/taskServices.js'

export async function createTask(req, res) {
  try {
    const { projectId } = req.params    
    const { title, description, priority, dueDate, assignments } = req.body
    const creator = req.user.id
    const data = await taskServices.createTask({ title, description, priority, dueDate, assignments, creator, projectId })

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: data
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function getUserTasks(req, res) {
  try {
    const userId = req.user.id
    const data = await taskServices.getUserTasks(userId)

    res.status(200).json({
      success: true,
      data
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function getAllProjectTasks(req, res) {
  try {
    const { projectId } = req.params
    const data = await taskServices.getAllProjectTasks(projectId)

    res.status(200).json({
      success: true,
      data: data
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function getTask(req, res) {
  try {
    const { taskId } = req.params
    const data = await taskServices.getTask(taskId)

    res.status(200).json({
      success: true,
      data
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function updateTask(req, res) {
  try {
    const { taskId } = req.params
    const updateFields = req.body
    const data = await taskServices.updateTask({ taskId, updateFields })

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: data
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function deleteTask(req, res) {
  try {
    const { taskId } = req.params
    await taskServices.deleteTask(taskId)
    
    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}