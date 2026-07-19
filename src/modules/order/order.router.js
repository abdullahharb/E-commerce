import express from 'express'
import * as order from './order.controller.js'
import { validation } from '../../middleware/validation.js'
import { createOrderSchema } from './order.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const orderRouter = express.Router()

orderRouter.route('/')
    .post(protectedRoutes, allowedTo('user'), validation(createOrderSchema), order.createCashOrder)
    .get(protectedRoutes, allowedTo('user'), order.getUserOrder)

orderRouter.get('/all', protectedRoutes, allowedTo('admin'), order.getAllOrders)

orderRouter.post('/checkOut', protectedRoutes, allowedTo('user'), order.createCheckOutSession)


orderRouter.get('/success', order.getSuccessOrder);
orderRouter.get('/cancel', order.getCancelOrder);

export default orderRouter
