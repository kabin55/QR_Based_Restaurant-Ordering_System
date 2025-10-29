import { Router } from 'express'

import * as crudController from '../controllers/crudController.js'
import * as detailController from '../controllers/detailController.js'
import * as orderController from '../controllers/orderController.js'
import * as dashboardController from '../controllers/dashboardController.js'
import * as auth from '../controllers/authController.js'

export const router = Router()

router.post('/items/:restaurantId', crudController.addItem)
router.patch('/items/:restaurantId/:itemId', crudController.updateItem)
router.delete('/items/:restaurantId/:itemId', crudController.deleteItemFromList)

router.post('/details', detailController.createDetail)
router.patch('/details/:restaurantId', detailController.updateDetail)

router.get('/orders/:restaurantId', orderController.getAllOrders)
// router.patch('/orders/:restaurantId/:orderId', orderController.patchOrders)
router.patch('/orders/:orderId', orderController.patchOrders)

router.get('/dashboard/:restaurantId', dashboardController.getEarningDetails)
router.post('/logout', auth.logout)
