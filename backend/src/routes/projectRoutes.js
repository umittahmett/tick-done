import express from 'express'
import { createProject, updateProject, deleteProject, getProject, getUserProjects, addMemberToProject, deleteMemberFromProject } from '../controllers/projectControllers.js'
import { auth } from '../middlewares/authMiddleware.js'
import { isProjectCreator, isProjectMember } from '../middlewares/projectMiddleware.js'

const router = express.Router()

router.post('/create', auth, createProject)
router.delete('/delete', auth, isProjectCreator, deleteProject)
router.put('/update', auth, isProjectCreator, updateProject)
router.get('/get', auth, isProjectMember, getProject)
router.get('/getUserProjects', auth, getUserProjects)
router.post('/addMember', auth, isProjectCreator, addMemberToProject)
router.post('/deleteMember', auth, isProjectCreator, deleteMemberFromProject)

export default router
