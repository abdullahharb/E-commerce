import express from 'express'
import * as cart from './cart.controller.js'
import { validation } from '../../middleware/validation.js'
import { createCartSchema, applyCouponSchema, updateQuantitySchema, removeCartSchema } from './cart.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const cartRouter = express.Router()


cartRouter.route('/')
    .post(protectedRoutes, allowedTo('user'), validation(createCartSchema), cart.addProductToCart)
    .get(protectedRoutes, allowedTo('user'), cart.getLoggedUserCart)

cartRouter.route('/:id')
    .put(protectedRoutes, allowedTo('user'), validation(updateQuantitySchema), cart.updateQuantity)
    .delete(protectedRoutes, allowedTo('user'), validation(removeCartSchema), cart.removeProductFromCart)


cartRouter.route('/applyCoupon').
    post(protectedRoutes, allowedTo('user'), validation(applyCouponSchema), cart.applyCoupon)

export default cartRouter
