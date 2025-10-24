import User from '../models/User.js'
import Task from '../models/Task.js'
import Project from '../models/Project.js'
import dotenv from 'dotenv'
import { AppError } from '../utils/appError.js'

dotenv.config()

export async function getUserTasks(userId) {
  try {
    const tasks = await Task.find({
      assignments: userId
    })
    .populate('assignments', '_id fullname title email')
    .populate('project', '_id name')
    
    return tasks 
  } catch (error) {
    console.error("Service Error:", error);
  
    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function getAllProjectTasks(projectId) {
  try {
    const tasks = await Task.find({
      project: projectId,
    })
    .populate('creator', '_id fullname title email')
    .populate('assignments', '_id fullname title email')
    .populate('project', '_id name')
    
    return tasks 
  } catch (error) {
    console.error("Service Error:", error);
  
    if (!error.isOperational) {
        throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function getTask(taskId) {
  try {
    const task = await Task.findOne({ _id: taskId })
    .populate('creator', '_id fullname title email')
    .populate('assignments', '_id fullname title email')
    .populate('project', '_id name')
    
    if(!task) throw new AppError('Task not found', 404)

    return task 
  } catch (error) {
    console.error("Service Error:", error);

    if (!error.isOperational) {
        throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function createTask({ title, description, priority, dueDate, assignments, creator, projectId }) {
  try {
    const user = await User.findOne({ _id: creator })
    if(!user) throw new AppError('User not found')
    
    const project = await Project.findOne({ _id: projectId })
    if(!project) throw new AppError('Project not found', 404)
    
    if(assignments && assignments.length > 0) {
      const foundUsers = await User.find({ _id: { $in: assignments } })
      if(foundUsers.length !== assignments.length) {
        throw new AppError('Invalid assignment data', 400)
      }
      
      const projectMembers = [...project.members, project.creator]
      const invalidAssignments = assignments.filter(assignmentId => 
        !projectMembers.some(memberId => memberId.toString() === assignmentId.toString())
      )
      
      if(invalidAssignments.length > 0) {
        throw new AppError('Invalid assignment data', 403)
      }
    }
  
    const task = new Task({ 
      title, 
      description, 
      priority, 
      dueDate, 
      assignments, 
      creator,
      project: projectId
    })
    await task.save()
  
    return { task }
  } catch (error) {
    console.error("Service Error:", error);

    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function updateTask({ taskId, updateFields }) {
  try {
    const task = await Task.findOne({ _id: taskId })
    if(!task) throw new AppError('Task not found', 404)
  
    if(updateFields.assignments) {
      const project = await Project.findOne({ _id: task.project })
      if(!project) throw new AppError('Project not found', 404)
      
      const foundUsers = await User.find({ _id: { $in: updateFields.assignments } })
      if(foundUsers.length !== updateFields.assignments.length) {
        throw new AppError('Invalid assignment data', 400)
      }
      
      const projectMembers = [...project.members, project.creator]
      const invalidAssignments = updateFields.assignments.filter(assignmentId => 
        !projectMembers.some(memberId => memberId.toString() === assignmentId.toString())
      )
      
      if(invalidAssignments.length > 0) {
        throw new AppError('Invalid assignment data', 403)
      }
    }
  
    const allowedFields = ['title', 'description', 'assignments', 'priority', 'dueDate', 'status']
    allowedFields.forEach(field => {
      if(updateFields[field] !== undefined) {
        task[field] = updateFields[field]
      }
    })
  
    await task.save()
  
    return task
  } catch (error) {
    console.error("Service Error:", error);

    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function deleteTask(taskId) {
  try {
    const task = await Task.findOne({ _id: taskId })
    if(!task) throw new AppError('Task not found', 404)
  
    await task.deleteOne()
  
    return { task }
  } catch (error) {
    console.error("Service Error:", error);
  
    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}