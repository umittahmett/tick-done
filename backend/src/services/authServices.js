import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AppError } from '../utils/appError.js'
import crypto from 'crypto'
import { createTransport } from 'nodemailer'

dotenv.config()

export async function register({ fullname, title, email, password }) {
  const userExists = await User.findOne({ email })
  if(userExists) throw new AppError('User already exists', 409)

  const user = new User({ fullname, title, email, password })
  await user.save()

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" })
  
  const userInfo = {
    id: user._id,
    email: user.email,
    fullname: user.fullname,
    title: user.title,
    createdAt: user.createdAt
  }
  
  return { user: userInfo, token }
}

export async function login({ email, password }) {
  const user = await User.findOne({ email })
  if(!user) throw new AppError('User not found', 404)

  const valid = await user.comparePassword(password)
  if(!valid) throw new AppError('Wrong password', 401)

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" })
  
  const userInfo = {
    id: user._id,
    email: user.email,
    fullname: user.fullname,
    title: user.title,
    createdAt: user.createdAt
  }
  
  return { user: userInfo, token }
}

export async function getMe(userId) {
  const user = await User.findById(userId).select('-password')
  if(!user) throw new AppError('User not found', 404)
  
  return user
}

export async function refreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.id).select('-password')
    if(!user) throw new AppError('User not found', 404)
    
    const newToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" })
    
    return { token: newToken, user }
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new AppError('Invalid refresh token', 403)
    } else if (err.name === 'TokenExpiredError') {
      throw new AppError('Refresh token expired', 403)
    }
    throw new AppError('Token refresh failed', 500)
  }
}

export async function forgotPassword(email) {
  try {
    const user = await User.findOne({ email })
    
    if (user) {
      const otp = (await crypto.randomInt(0, 1000000)).toString().padStart(6, '0')
      
      const otpHash = crypto.createHmac('sha256', APP_SECRET).update(`${otp}:${user._id.toString()}`).digest('hex')
      
      user.otpHash = otpHash
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 min
      await user.save()

      createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: '9904de001@smtp-brevo.com',
          pass: process.env.BREVO_API_KEY
        }
      }).sendMail({
        from: 'tckdone@gmail.com',
        to: email,
        subject: 'Password Reset',
        html: `<p>Your password reset code is: <strong>${otp}</strong></p>`
      },function(error,info){
        if(error){
          console.log('Email error type:', typeof error)
          console.log('Email error:', error)
          console.log('Email error message:', error.message)
          console.log("Info",info);
          throw new AppError('Email sending failed', 500)
        }
        else{
          console.log('Email sent successfully')
        }
      })
    }
    
    return { message: 'If an account with this email exists, a password reset code has been sent' }
  } catch (err) {
    throw err
  }
}

export async function verifyOtp(email, otp) {
  const user = await User.findOne({ email })
  
  if (!user || !user.otpHash || !user.otpExpires) {
    throw new AppError('Invalid or expired OTP', 401)
  }

  if (user.otpExpires < Date.now()) {
    throw new AppError('Invalid or expired OTP', 401)
  }

  const incomingHash = crypto.createHmac('sha256', APP_SECRET).update(`${otp}:${user._id.toString()}`).digest()
  const storedHash = Buffer.from(user.otpHash, 'hex')

  if (incomingHash.length !== storedHash.length) {
    throw new AppError('Invalid or expired OTP', 401)
  }

  if (!crypto.timingSafeEqual(incomingHash, storedHash)) {
    throw new AppError('Invalid or expired OTP', 401)
  }

  user.otpHash = null
  user.otpExpires = null

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenHash = crypto.createHmac('sha256', APP_SECRET).update(`${resetToken}:${user._id.toString()}`).digest('hex')
  const resetTokenExpire = new Date(Date.now() + 10 * 60 * 1000) // 10 min

  user.resetPasswordTokenHash = resetTokenHash
  user.resetPasswordTokenExpires = resetTokenExpire

  await user.save()

  return { message: 'OTP verified successfully', resetToken }
}

export async function resetPassword(email, token, newPassword) {
  
  const user = await User.findOne({ email })
  if (!user || !user.resetPasswordTokenHash || !user.resetPasswordTokenExpires || user.resetPasswordTokenExpires < Date.now()) {
    throw new AppError('Invalid or expired reset token', 401)
  }

  const incomingHash = crypto.createHmac('sha256', APP_SECRET).update(`${token}:${user._id.toString()}`).digest()
  const storedHash = Buffer.from(user.resetPasswordTokenHash, 'hex')

  if (incomingHash.length !== storedHash.length || !crypto.timingSafeEqual(incomingHash, storedHash)) {
    throw new AppError('Invalid or expired reset token', 401)
  }

  user.password = newPassword

  user.resetPasswordTokenHash = null
  user.resetPasswordTokenExpires = null

  await user.save()

  return { message: 'Password has been reset successfully' }
}