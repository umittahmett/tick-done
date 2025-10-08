import dotenv from 'dotenv'
import Project from '../models/Project.js'

dotenv.config()

export async function isProjectCreator(req, res, next) {
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
      return res.status(403).json({ message: 'Only project creator can perform this action' })
    }

    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function isProjectMember(req, res, next) {
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
      return res.status(403).json({ message: 'Access denied. You are not a member of this project' })
    }

    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
