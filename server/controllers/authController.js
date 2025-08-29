import { token } from '../middleware/token.js'

export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    console.log('Login attempt with username:', username)

    if (username === 'username' && password === 'password') {
      const jwtToken = token(res, { username }) // pass res + payload

      console.log(`token ${jwtToken} set in cookie for user:`, username)
      return res
        .status(200)
        .json({ message: 'Login successful', username, token: jwtToken })
    }

    console.log('Login failed for user:', username)
    return res.status(401).json({ message: 'Invalid credentials' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error during login', error: error.message })
  }
}
