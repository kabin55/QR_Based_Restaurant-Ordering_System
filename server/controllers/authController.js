// import details from '../models/detailModel.js'

export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (username == 'username' && password == 'password') {
      return res.status(200).json({ message: 'Login successful', user })
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error during login', error: error.message })
  }
}
