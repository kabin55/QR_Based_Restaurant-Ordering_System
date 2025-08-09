import { Router } from 'express'

import * as userController from '../controllers/userController.js'
import * as authController from '../controllers/authController.js'
import * as crudController from '../controllers/crudController.js'

export const router = Router()

router.post('/login', authController.login)
router.post('/items', crudController.addItem)

router.get('/items', userController.getItems)
router.get('/items/:id', userController.getItemById)
