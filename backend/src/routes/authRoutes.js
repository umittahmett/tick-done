import express from 'express'
import { register, login, logout, getMe, refreshToken, forgotPassword, resetPassword } from '../controllers/authControllers.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/me', getMe)
router.post('/refresh-token', refreshToken)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
