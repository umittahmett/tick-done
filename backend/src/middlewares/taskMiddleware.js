import Task from '../models/Task.js'
import Project from '../models/Project.js'
import { AppError } from '../utils/appError.js'
import mongoose from 'mongoose'

export async function canViewTask(req, res, next) {
  try {
    const { taskId } = req.params
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError('Task id is invalid or not defined', 400)
    }

    const task = await Task.findById(taskId).populate('project')
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    const isProjectCreator = task.project.creator.toString() === req.user.id
    const isProjectMember = task.project.members.includes(req.user.id)

    if (!isProjectCreator && !isProjectMember) {
      throw new AppError('Access denied. You must be a project member to view this task', 403)
    }

    req.task = task
    next()
  } catch (err) {
    next(err)
  }
}

export async function canDeleteTask(req, res, next) {
  try {
    const { taskId } = req.params
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError('Task ID is invalid or not defined', 400)
    }

    const task = await Task.findById(taskId).populate('project', '_id creator')
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    if (task.project.creator.toString() !== req.user.id) {
      throw new AppError('Only project creator can delete tasks', 403)
    }

    req.task = task
    next()
  } catch (err) {
    next(err)
  }
}

export async function canManageProjectTasks(req, res, next) {
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
      throw new AppError('Only project creator can manage tasks', 403)
    }

    req.project = project
    next()
  } catch (err) {
    next(err)
  }
}

export async function canUpdateTask(req, res, next) {
  try {
    const { taskId } = req.params
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError('Task id is invalid or not defined', 400)
    }

    const task = await Task.findById(taskId).populate('project')
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    const isProjectCreator = task.project.creator.toString() === req.user.id
    const isAssigned = task.assignments.includes(req.user.id)

    if (!isProjectCreator && !isAssigned) {
      throw new AppError('Only project creator or assigned users can update this task', 403)
    }

    req.task = task
    next()
  } catch (err) {
    next(err)
  }
}

export async function canViewProjectTasks(req, res, next) {
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
      throw new AppError('You must be a project member to view tasks', 403)
    }

    req.project = project
    next()
  } catch (err) {
    next(err)
  }
}
