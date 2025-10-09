import dotenv from 'dotenv'
import Project from '../models/Project.js'
import { AppError } from '../utils/appError.js'
import mongoose from 'mongoose'

dotenv.config()

export async function isProjectCreator(req, res, next) {
  try {
    const { projectId } = req.params
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      throw new AppError('Project ID is invalid or not defined', 400)
    }

    const project = await Project.findById(projectId)
    if (!project) {
      throw new AppError('Project not found', 404)
    }

    if (project.creator.toString() !== req.user.id) {
      throw new AppError('Only project creator can perform this action', 403)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export async function isProjectMember(req, res, next) {
  try {
    const { projectId } = req.params
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      throw new AppError('Project ID is invalid or not defined', 400)
    }

    const project = await Project.findById(projectId)
    if (!project) {
      throw new AppError('Project not found', 404)
    }

    const isCreator = project.creator.toString() === req.user.id
    const isMember = project.members.includes(req.user.id)

    if (!isCreator && !isMember) {
      throw new AppError('Access denied. You are not a member of this project', 403)
    }

    next()
  } catch (err) {
    next(err)
  }
}
