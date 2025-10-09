import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AppError } from '../utils/appError.js'

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
