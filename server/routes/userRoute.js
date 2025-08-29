import { Router } from 'express'

import * as userController from '../controllers/userController.js'
import * as authController from '../controllers/authController.js'
import * as orderController from '../controllers/orderController.js'
import * as detailController from '../controllers/detailController.js'
import { protectedRoute } from '../middleware/token.js'

export const router = Router()

router.post('/login', authController.login)

router.get('/items', userController.getItems)

router.post('/validate', detailController.getDetail)
router.post('/order', orderController.newOrder)

router.post('/details', detailController.createDetail)

router.get('/check-auth', protectedRoute, (req, res) => {
  res.status(200).json({ message: 'Authenticated' })
})
