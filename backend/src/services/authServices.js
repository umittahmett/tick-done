import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export async function register({ fullname, title, email, password }) {
  const userExists = await User.findOne({ email })
  if(userExists) throw new Error('User already exists')

  const user = new User({ fullname, title, email, password })
  await user.save()

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" })
  return { user, token }
}

export async function login({ email, password }) {
  const user = await User.findOne({ email })
  if(!user) throw new Error('User not found')

  const valid = await user.comparePassword(password)
  if(!valid) throw new Error('Wrong password')

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" })
  return { user, token }
}
