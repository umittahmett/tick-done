import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AppError } from '../utils/appError.js'

dotenv.config()

export function auth(req, res, next) {
  try {
    // Cookie'den token al
    const token = req.cookies.token
    if(!token) {
      throw new AppError('No token provided', 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    console.log(err)
    if (err.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 403))
    } else if (err.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 403))
    } else {
      next(err)
    }
  }
}
