
import * as projectServices from '../services/projectServices.js'

export async function getProject(req, res) {
  try {
    const { projectId } = req.params
    const data = await projectServices.getProject(projectId)

    res.status(200).json({
      success: true,
      data: data
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
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
    res.status(err.status || 500).json({ message: err.message })
  }
}
  
export async function createProject(req, res) {
  try {
    const { name, description } = req.body
    const creator = req.user.id
    const data = await projectServices.createProject({ name, description, creator })

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: data
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function deleteProject(req, res) {
  try {
    const { projectId } = req.params
    await projectServices.deleteProject(projectId)

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function updateProject(req, res) {
  try {
    const { projectId } = req.params
    const updateFields = req.body
    const data = await projectServices.updateProject({ projectId, updateFields })

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: data
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function addMemberToProject(req, res) { 
  try {
    const { projectId } = req.params
    const { invitee, inviter } = req.body
    const data = await projectServices.addMemberToProject({ projectId, invitee, inviter })
    
    res.status(200).json({
      success: true,
      message: "Invitation sent successfully",
      data: data
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function deleteMemberFromProject(req, res) { 
  try {
    const { projectId } = req.params
    const { email } = req.body
    await projectServices.deleteMemberFromProject({ projectId, email })

    res.status(200).json({
      success: true,
      message: "Member removed successfully"
    })
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function handleInvitation(req, res) { 
  try {
    const { status, token } = req.body
    const data = await projectServices.handleInvitation({ token, status })

    res.status(200).json({
      success: true,
      message: data.message,
    })

  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}
