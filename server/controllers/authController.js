import { token } from '../middleware/token.js'
import { Detail } from '../models/detailModel.js'
import bcrypt from 'bcrypt'

export const login = async (req, res) => {
  try {
    const { restaurantId, username, password } = req.body
    // console.log(
    //   'Login attempt with username:',
    //   restaurantId,
    //   username,
    //   password
    // )

    //  Validate input
    if (!restaurantId || !username || !password) {
      return res
        .status(400)
        .json({ message: 'Restaurant ID, Username and password are required' })
    }

    // Find restaurant with matching ID and username in one query
    const detail = await Detail.findOne({
      restaurantId: restaurantId,
      'loginCredentials.username': username,
    })

    if (!detail) {
      // console.log(
      //   ` Invalid login attempt for restaurantId=${restaurantId}, username=${username}`
      // )
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const storedPassword = detail.loginCredentials.password

    // Compare hashed password with entered password
    const isMatch = await bcrypt.compare(password, storedPassword)
    if (!isMatch) {
      // console.log(' Password mismatch for user:', username)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    //  Generate JWT token & set cookie
    const jwtToken = token(res, { username })
    // console.log(` Token generated & set in cookie for user: ${username}`)

    return res.status(200).json({
      message: 'Login successful',
      username,
      token: jwtToken,
    })
  } catch (error) {
    console.error(' Error during login:', error.message)
    res
      .status(500)
      .json({ message: 'Error during login', error: error.message })
  }
}

export const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    })
    return res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.error('🔥 Error during logout:', error.message)
    res
      .status(500)
      .json({ message: 'Error during logout', error: error.message })
  }
}
