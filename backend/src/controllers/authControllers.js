import * as authServices from '../services/authServices.js'

export async function register(req, res) {
  try {
    const { fullname, title, email, password } = req.body
    const data = await authServices.register({ fullname, title, email, password })
    res.json(data)
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    const data = await authServices.login({ email, password })
    res.json(data)
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}
