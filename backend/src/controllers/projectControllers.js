
import * as projectServices from '../services/projectServices.js'

export async function getProject(req, res) {
  try {
    const { projectId } = req.body
    const data = await projectServices.getProject({ projectId })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
  
export async function createProject(req, res) {
  try {
    const { name, description } = req.body
    const creator = req.user.id
    const data = await projectServices.createProject({ name, description, creator })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function updateProject(req, res) {
  try {
    const { projectId, ...updateFields } = req.body
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' })
    }
    
    const data = await projectServices.updateProject({ projectId, updateFields })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function deleteProject(req, res) {
  try {
    const { projectId } = req.body
    const data = await projectServices.deleteProject({ projectId })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}