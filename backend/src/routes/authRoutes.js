import express from 'express'
import { register, login, logout, getMe, refreshToken, forgotPassword, resetPassword, verifyOtp } from '../controllers/authControllers.js'
import { auth } from '../middlewares/authMiddleware.js'
import { validate } from '../middlewares/validateMiddleware.js'
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  verifyOtpSchema 
} from '../validation/auth/index.js'

const router = express.Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', auth, logout)
router.post('/me', auth, getMe)
router.post('/refresh-token', refreshToken)
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp)
router.post('/reset-password', validate(resetPasswordSchema), resetPassword)

export default router
