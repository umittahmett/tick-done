import User from '../models/User.js'
import Project from '../models/Project.js'
import dotenv from 'dotenv'
import Task from '../models/Task.js'

dotenv.config()

export async function getProject(projectId) {
  const project = await Project.findOne({ _id: projectId })
  if(!project) throw new Error('Project not found')

  return { project }
}

export async function getUserProjects(userId) {
  const projects = await Project.find({
    $or: [
      { creator: userId },
      { members: userId }
    ]
  }).populate('creator members')

  return { projects }
}

export async function createProject({ name, description, creator }) {
  const user = await User.findOne({ _id: creator })
  if(!user) throw new Error('User not found')

  const project = new Project({ name, description, creator })
  await project.save()

  return { project }
}

export async function updateProject({ projectId, updateFields }) {
  const project = await Project.findOne({ _id: projectId })
  if(!project) throw new Error('Project not found')

  const allowedFields = ['name', 'description']
  allowedFields.forEach(field => {
    if(updateFields[field] !== undefined) {
      project[field] = updateFields[field]
    }
  })

  await project.save()
  return { project }
}

export async function deleteProject(projectId) {
  const project = await Project.findOne({ _id: projectId })
  if(!project) throw new Error('Project not found')
  
  const tasks = await Task.find({ project: projectId })
  
  if(tasks.length > 0) {
    await Task.deleteMany({ project: projectId })
  }

  await project.deleteOne()

  return { project }
}

export async function addMemberToProject({ projectId, memberId }) {
  const project = await Project.findOne({ _id: projectId })
  if(!project) throw new Error('Project not found')

  const user = await User.findOne({ _id: memberId })
  if(!user) throw new Error('User not found')

  project.members.push(memberId)
  await project.save()

  return { project }
}

export async function deleteMemberFromProject({ projectId, memberId }) { 
  const project = await Project.findOne({ _id: projectId })
  if(!project) throw new Error('Project not found')

  const user = await User.findOne({ _id: memberId })
  if(!user) throw new Error('User not found')

  project.members.pull(memberId)
  await project.save()

  return { project }
}