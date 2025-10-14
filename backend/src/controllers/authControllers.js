import * as authServices from '../services/authServices.js'

export async function register(req, res) {
  try {
    const { fullname, title, email, password } = req.body
    const data = await authServices.register({ fullname, title, email, password })
    
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user: data.user }
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    const data = await authServices.login({ email, password })
    
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    })

    res.cookie('refreshToken', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    })
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: data.user }
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    })
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    })
    
    res.status(200).json({
      success: true,
      message: "Logout successful"
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function getMe(req, res) {
  try {
    const user = await authServices.getMe(req.user.id)
    
    res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      data: user 
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not provided"
      })
    }
    
    const data = await authServices.refreshToken(refreshToken)
    
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    })
    
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: data.user 
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      })
    }
    
    const result = await authServices.forgotPassword(email)
    
    res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      })
    }
    
    const result = await authServices.verifyOtp(email, otp)
    
    res.cookie('resetPasswordToken', result.resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 10 * 60 * 1000 // 10 min
    })

    res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}

export async function resetPassword(req, res) {
  try {
    const token = req.cookies.resetPasswordToken
    const { email, newPassword } = req.body

    if (!token) return res.status(400).json({ message: 'Token is required' })
    if (!newPassword || !email) {
      return res.status(400).json({ message: 'Email and new password are required' })
    }
    
    const result = await authServices.resetPassword(email,token,newPassword)
    
    res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}