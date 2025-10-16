
import * as projectServices from '../services/projectServices.js'

export async function getProject(req, res) {
  try {
    const { projectId } = req.params

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' })
    }
    
    const data = await projectServices.getProject(projectId)
    res.status(200).json({
      success: true,
      data: data
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function getUserProjects(req, res) {
  try {
    const data = await projectServices.getUserProjects(req.user.id)
    res.status(200).json({
      success: true,
      data: data
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
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
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: data
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function deleteProject(req, res) {
  try {
    const { projectId } = req.params

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' })
    }

    await projectServices.deleteProject(projectId)
    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
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
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: data
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function addMemberToProject(req, res) { 
  try {
    const { projectId } = req.params
    const { invitee, inviter } = req.body

    if (!projectId || !invitee || !inviter) {
      return res.status(400).json({ message: 'Project ID and Member ID are required' })
    }

    const data = await projectServices.addMemberToProject({ projectId, invitee, inviter })
    res.status(200).json({
      success: true,
      message: "Invitation sent successfully",
      data: data
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function deleteMemberFromProject(req, res) { 
  try {
    const { projectId } = req.params
    const { email } = req.body

    if (!projectId || !email) {
      return res.status(400).json({ message: 'Project ID and Member ID are required' })
    }

    await projectServices.deleteMemberFromProject({ projectId, email })
    res.status(200).json({
      success: true,
      message: "Member removed successfully"
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function handleInvitation(req, res) { 
  try {
    const { status, token } = req.body
    const allowedStatus = ['accept', 'reject'];

    if (!token || !status) {
      return res.status(400).json({ message: 'Token and Status are required' })
    }
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const data = await projectServices.handleInvitation({ token, status })

    res.status(200).json({
      success: true,
      message: data.message,
    })

  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}
