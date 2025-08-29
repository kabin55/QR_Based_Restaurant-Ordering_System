import { Router } from 'express'

import * as crudController from '../controllers/crudController.js'
import * as detailController from '../controllers/detailController.js'
import * as orderController from '../controllers/orderController.js'
import * as dashboardController from '../controllers/dashboardController.js'

export const router = Router()

router.post('/items', crudController.addItem)
router.patch('/items/:id', crudController.updateItem)
router.delete('/items/:id', crudController.deleteItem)

router.post('/details', detailController.createDetail)
router.patch('/details/:resturentId', detailController.updateDetail)

router.get('/orders/all', orderController.getAllOrders)
router.patch('/orders/:orderId', orderController.patchOrders)

router.get('/dashboard/earning', dashboardController.getEarningDetails)
