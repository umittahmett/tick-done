
import * as projectServices from '../services/projectServices.js'

export async function getProject(req, res) {
  try {
    const { projectId } = req.params

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' })
    }
    
    const data = await projectServices.getProject(projectId)
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function getUserProjects(req, res) {
  try {
    const data = await projectServices.getUserProjects(req.user.id)
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
  
export async function createProject(req, res) {
  try {
    const { name, description } = req.body
    const creator = req.user.id

    if (!name) {
      return res.status(400).json({ message: 'Name is required' })
    }
    
    const data = await projectServices.createProject({ name, description, creator })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function deleteProject(req, res) {
  try {
    const { projectId } = req.params

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' })
    }

    const data = await projectServices.deleteProject(projectId)
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function updateProject(req, res) {
  try {
    const { projectId } = req.params
    const updateFields = req.body

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' })
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'At least one field is required to update' })
    }
    
    const data = await projectServices.updateProject({ projectId, updateFields })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function addMemberToProject(req, res) { 
  try {
    const { projectId } = req.params
    const { memberId } = req.body

    if (!projectId || !memberId) {
      return res.status(400).json({ message: 'Project ID and Member ID are required' })
    }

    const data = await projectServices.addMemberToProject({ projectId, memberId })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function deleteMemberFromProject(req, res) { 
  try {
    const { projectId } = req.params
    const { memberId } = req.body

    if (!projectId || !memberId) {
      return res.status(400).json({ message: 'Project ID and Member ID are required' })
    }

    const data = await projectServices.deleteMemberFromProject({ projectId, memberId })
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}