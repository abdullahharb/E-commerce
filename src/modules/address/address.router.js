import express from 'express'
import * as address from './address.controller.js'
import { validation } from '../../middleware/validation.js'
import { addAddressesSchema, DeleteAddressesSchema } from './address.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const addressRouter = express.Router()

addressRouter.route('/')
    .patch(protectedRoutes, allowedTo('user'), validation(addAddressesSchema), address.addAddress)
    .delete(protectedRoutes, allowedTo('user'), validation(DeleteAddressesSchema), address.removeAddress)
    .get(protectedRoutes, allowedTo('user'), address.getAllUserAddress)

export default addressRouter
