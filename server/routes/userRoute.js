import { Router } from 'express'

import * as crudController from '../controllers/crudController.js'
import * as authController from '../controllers/authController.js'
import * as orderController from '../controllers/orderController.js'
import * as detailController from '../controllers/detailController.js'
import { protectedRoute } from '../middleware/token.js'

export const router = Router()

router.get('/items/:restaurantId', crudController.getItems)
router.get('/check-auth', protectedRoute, (req, res) => {
  res.status(200).json({ message: 'Authenticated' })
})

router.post('/validate', detailController.getDetail)
router.post('/order/:restaurantId', orderController.newOrder)
router.post('/details', detailController.createDetail)
router.post('/login', authController.login)
