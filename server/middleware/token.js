import jwt from 'jsonwebtoken'

export const token = (res, payload) => {
  const secretKey = process.env.TOKEN_SECRET
  // console.log('Generating token with secret key:', secretKey)
  if (!secretKey) throw new Error('TOKEN_SECRET not set')

  // Always wrap payload in an object so JWT gets a proper claim set
  const jwtToken = jwt.sign({ user: payload }, secretKey, { expiresIn: '1d' })
  // console.log('Generated JWT:', jwtToken)

  res.cookie('token', jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })

  return jwtToken
}

export const protectedRoute = (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized: No token' })
    }

    const secretKey = process.env.TOKEN_SECRET
    const decoded = jwt.verify(token, secretKey) // verify signature

    req.user = decoded // attach payload to request for later use
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' })
  }
}
