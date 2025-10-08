import express from 'express'
import { createProject, updateProject, deleteProject, getProject, getUserProjects, addMemberToProject, deleteMemberFromProject } from '../controllers/projectControllers.js'
import { auth } from '../middlewares/authMiddleware.js'
import { isProjectCreator, isProjectMember } from '../middlewares/projectMiddleware.js'

const router = express.Router()

router.post('/createProject', auth, createProject)
router.delete('/deleteProject', auth, isProjectCreator, deleteProject)
router.put('/updateProject', auth, isProjectCreator, updateProject)
router.get('/getProject', auth, isProjectMember, getProject)
router.get('/getUserProjects', auth, getUserProjects)
router.post('/addMemberToProject', auth, isProjectCreator, addMemberToProject)
router.post('/deleteMemberFromProject', auth, isProjectCreator, deleteMemberFromProject)

export default router
