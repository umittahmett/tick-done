import Task from '../models/Task.js'
import Project from '../models/Project.js'

export async function canViewTask(req, res, next) {
  try {
    const { taskId } = req.params
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' })
    }

    const task = await Task.findById(taskId).populate('project')
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const isProjectCreator = task.project.creator.toString() === req.user.id
    const isProjectMember = task.project.members.includes(req.user.id)

    if (!isProjectCreator && !isProjectMember) {
      return res.status(403).json({ message: 'Access denied. You must be a project member to view this task' })
    }

    req.task = task
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function canManageProjectTasks(req, res, next) {
  try {
    const { projectId } = req.params
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' })
    }

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project creator can manage tasks' })
    }

    req.project = project
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function canUpdateTask(req, res, next) {
  try {
    const { taskId } = req.params
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' })
    }

    const task = await Task.findById(taskId).populate('project')
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const isProjectCreator = task.project.creator.toString() === req.user.id
    const isAssigned = task.assignments.includes(req.user.id)

    if (!isProjectCreator && !isAssigned) {
      return res.status(403).json({ message: 'Only project creator or assigned users can update this task' })
    }

    req.task = task
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function canViewProjectTasks(req, res, next) {
  try {
    const { projectId } = req.params
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' })
    }

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const isCreator = project.creator.toString() === req.user.id
    const isMember = project.members.includes(req.user.id)

    if (!isCreator && !isMember) {
      return res.status(403).json({ message: 'You must be a project member to view tasks' })
    }

    req.project = project
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
