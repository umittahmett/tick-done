import User from '../models/User.js'
import Project from '../models/Project.js'
import dotenv from 'dotenv'
import Task from '../models/Task.js'
import { AppError } from '../utils/appError.js'
import { sendNotification } from './notifications/notificationServices.js'
import Invitation from '../models/Invitation.js'
import jwt from 'jsonwebtoken'

dotenv.config()

export async function getProject(projectId) {
  try {
    const project = await Project.findOne({ _id: projectId })  
    .populate('creator', '_id fullname title email')
    .populate('members', '_id fullname title email')
    
    if(!project) throw new AppError('Project not found', 404)
  
    return project
  } catch (error) {
    console.error("Service Error:", error);
  
    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function getUserProjects(userId) {
  try {
    const projects = await Project.find({
      $or: [
        { creator: userId },
      ]
    })
    .populate('creator', '_id fullname title email')

    return projects 
  } catch (error) {
    console.error("Service Error:", error);
  
    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function getSharedProjects(userId) {
  try {
    const projects = await Project.find({
      members: userId
    })
    .populate('creator', '_id fullname title email')
    .populate('members', '_id fullname title email')
    
    return projects 
  } catch (error) {
    console.error("Service Error:", error);
  
    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function createProject({ name, description, creator }) {
  try {
    const user = await User.findOne({ _id: creator })
    if(!user) throw new AppError('User not found', 404)
  
    const project = new Project({ name, description, creator })
    await project.save()
  
    return project
  } catch (error) {
    console.error("Service Error:", error);
  
    if (!error.isOperational) {
        throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function updateProject({ projectId, updateFields }) {
  try {
    const project = await Project.findOne({ _id: projectId })
    if(!project) throw new AppError('Project not found', 404)
  
    const allowedFields = ['name', 'description']
    allowedFields.forEach(field => {
      if(updateFields[field] !== undefined) {
        project[field] = updateFields[field]
      }
    })
  
    await project.save()
    return project
  } catch (error) {
    console.error("Service Error:", error);
  
    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function deleteProject(projectId) {
  try {
    const project = await Project.findOne({ _id: projectId })
    if(!project) throw new AppError('Project not found', 404)
    
    const tasks = await Task.find({ project: projectId })
    
    if(tasks.length > 0) {
      await Task.deleteMany({ project: projectId })
    }
  
    await project.deleteOne()
  
    return project
  } catch (error) {
    console.error("Service Error:", error);

    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function addMemberToProject({ projectId, invitee, inviter }) {
  try {
    const project = await Project.findOne({ _id: projectId })
    if(!project) throw new AppError('Project not found', 404)
    
    const inviterUser = await User.findOne({ email: inviter })
    if(!inviterUser) throw new AppError('User not found', 404)
    
    const inviteeUser = await User.findOne({ email: invitee })
    if(!inviteeUser) throw new AppError('User not found', 404)
    
    if(project.members.includes(inviteeUser._id)) throw new AppError('User is already a member of this project', 409)
    const hasInvited = await Invitation.findOne({ project: projectId, invitee, inviter, status: 'pending' })
    if(hasInvited) throw new AppError('User has already been invited to this project', 409)
    
    const token = jwt.sign({ projectId, invitee, inviter }, process.env.JWT_SECRET, { expiresIn: '7d' })
    const invitation = new Invitation({ project: projectId, inviter, invitee, token, tokenExpiry: Date.now() + 7 * 24 * 60 * 60 * 1000 })
    await invitation.save()
    
    await sendNotification({
      channel: ['email'],
      to: inviteeUser,
      subject: `${inviterUser.fullname} invited you to join project: ${project.name}`,
      emailContent: `
      <div style="text-align: center; font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border-radius: 8px; background-color: #f8f9fa;">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">Project Invitation</h2>
          <p style="color: #34495e; margin-bottom: 25px; line-height: 1.5;">
            Hi ${inviteeUser.fullname},<br>
            <strong>${inviterUser.fullname}</strong> invited you to join project <strong>"${project.name}"</strong>.
          </p>
          <div style="margin-top: 20px; margin-left: auto; margin-right: auto;">
            <a href="${process.env.FRONTEND_URL}/project-invitation?token=${token}&status=accept" 
               style="background-color: #2ecc71; color: white; padding: 10px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
              Accept
            </a>
            <a href="${process.env.FRONTEND_URL}/project-invitation?token=${token}&status=reject" 
               style="background-color: #e74c3c; color: white; padding: 10px 25px; margin-left: 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">
              Reject
            </a>
          </div>
        </div>`,
      type: 'projectInvite'
    });
    
    return project
  
  } catch (error) {
    console.error("Service Error:", error);
  
    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export async function deleteMemberFromProject({ projectId, email }) { 
  try {
    const project = await Project.findOne({ _id: projectId })
    if(!project) throw new AppError('Project not found', 404)
  
    const user = await User.findOne({ email })
    if(!user) throw new AppError('User not found', 404)
  
    if(!project.members.includes(user._id)) throw new AppError('User is not a member of this project', 400)
  
    project.members.pull(user._id)
    await project.save()
  
    return project
  } catch (error) {
    console.error("Service Error:", error);
  
    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
}

export const handleInvitation = async ({token, status}) => {
  try {
    const invitation = await Invitation.findOne({ token, status: 'pending' });
    if (!invitation) {
      throw new AppError('Invitation expired or already used', 404);
    }

    const [project, invitee] = await Promise.all([
      Project.findOne({ _id: invitation.project }),
      User.findOne({ email: invitation.invitee })
    ]);

    if (!project) throw new AppError('Project not found', 404);
    if (!invitee) throw new AppError('User not found', 404);

    if (status === 'accept') {
      invitation.status = 'accepted';
      project.members.push(invitee._id);
      
      await Promise.all([invitation.save(), project.save()]);

      await sendNotification({
        channel: ['app', 'email'],
        to: invitee,
        subject: `Welcome to ${project.name}`,
        emailContent: `
          <div style="text-align: center; font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border-radius: 8px; background-color: #f8f9fa;">
            <h2 style="color: #2c3e50; margin-bottom: 20px;">Welcome</h2>
            <p style="color: #34495e; margin-bottom: 25px; line-height: 1.5;">You have been added to project: ${project.name}</p>
          </div>`,
        appContent: `Hi ${invitee.fullname}, you have been added to project "${project.name}"`,
        type: 'generic'
      });

      return { message: 'Invitation successfully accepted.' };
    } else if (status === 'reject') {
      invitation.status = 'rejected';
      await invitation.save();

      return { message: 'Invitation successfully rejected.' };      
    } else {
      throw new AppError('Invalid operation type.', 400);
    }

  } catch (error) {
    console.error("Service Error:", error);
    
    if (!error.isOperational) {
      throw new AppError('Internal server error', 500); 
    }
    
    throw error;
  }
};