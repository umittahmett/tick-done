import * as authServices from '../services/authServices.js'

export async function register(req, res) {
  try {
    const { fullname, title, email, password } = req.body
    const data = await authServices.register({ fullname, title, email, password })
    
    // HttpOnly cookie'de token sakla
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user: data.user } // Token'ı response'dan çıkar
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    const data = await authServices.login({ email, password })
    
    // HttpOnly cookie'de token sakla
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 saat
    })
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: data.user } // Token'ı response'dan çıkar
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}
