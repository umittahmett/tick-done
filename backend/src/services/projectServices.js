import User from '../models/User.js'
import Project from '../models/Project.js'
import dotenv from 'dotenv'

dotenv.config()

export async function getProject({ projectId }) {
  const project = await Project.findOne({ _id: projectId })
  if(!project) throw new Error('Project not found')

  return { project }
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
  if(updateFields.members && updateFields.members.length < 1) throw new Error('Members must be at least 1')
  if(updateFields.members && updateFields.members.length > 0) {
    const foundUsers = await User.find({ _id: { $in: updateFields.members } })
    if(foundUsers.length !== updateFields.members.length) {
      throw new Error('Some assigned people not found')
    }
  }

  Object.keys(updateFields).forEach(key => {
    if(updateFields[key] !== undefined) {
      project[key] = updateFields[key]
    }
  })

  await project.save()

  return { project }
}

export async function deleteProject({ projectId }) {
  const project = await Project.findOne({ _id: projectId })
  if(!project) throw new Error('Project not found')

  await project.deleteOne()

  return { project }
}