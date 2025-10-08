import Task from '../models/Task.js'
import Project from '../models/Project.js'

export async function isTaskCreator(req, res, next) {
  try {
    const { taskId } = req.body
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' })
    }

    const task = await Task.findById(taskId).populate('project')
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only task creator can perform this action' })
    }

    req.task = task
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function canAccessTask(req, res, next) {
  try {
    const { taskId } = req.body
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' })
    }

    const task = await Task.findById(taskId).populate('project')
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const isTaskCreator = task.creator.toString() === req.user.id
    const isProjectCreator = task.project.creator.toString() === req.user.id
    const isAssigned = task.assignments.includes(req.user.id)
    const isProjectMember = task.project.members.includes(req.user.id)

    if (!isTaskCreator && !isProjectCreator && !isAssigned && !isProjectMember) {
      return res.status(403).json({ message: 'Access denied. You cannot access this task' })
    }

    req.task = task
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function canCreateTaskInProject(req, res, next) {
  try {
    const { projectId } = req.body
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' })
    }

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project creator can create tasks' })
    }

    req.project = project
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
