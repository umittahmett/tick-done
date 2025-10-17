import express from 'express'
import { createProject, updateProject, deleteProject, getProject, getUserProjects, addMemberToProject, deleteMemberFromProject, handleInvitation } from '../controllers/projectControllers.js'
import { auth } from '../middlewares/authMiddleware.js'
import { isProjectCreator, isProjectMember } from '../middlewares/projectMiddleware.js'
import { validate } from '../middlewares/validateMiddleware.js'
import { 
  createProjectSchema,
  updateProjectSchema,
  deleteProjectSchema, 
  getProjectSchema, 
  addMemberToProjectSchema, 
  deleteMemberFromProjectSchema, 
  handleInvitationSchema 
} from '../validation/project/index.js'

const router = express.Router()

router.post('/createProject', auth, validate(createProjectSchema), createProject)
router.delete('/deleteProject/:projectId', auth, isProjectCreator, validate(deleteProjectSchema), deleteProject)
router.put('/updateProject/:projectId', auth, isProjectCreator, validate(updateProjectSchema), updateProject)
router.get('/getProject/:projectId', auth, isProjectMember, validate(getProjectSchema), getProject)
router.get('/getUserProjects', auth, getUserProjects)
router.post('/addMemberToProject/:projectId', auth, isProjectCreator, validate(addMemberToProjectSchema), addMemberToProject)
router.post('/deleteMemberFromProject/:projectId', auth, isProjectCreator, validate(deleteMemberFromProjectSchema), deleteMemberFromProject)
router.post('/handleInvitation', auth, validate(handleInvitationSchema), handleInvitation)

export default router
