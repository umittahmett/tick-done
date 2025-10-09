import express from 'express'
import { register, login, logout, getMe, refreshToken } from '../controllers/authControllers.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/me', getMe)
router.post('/refresh-token', refreshToken)

export default router
