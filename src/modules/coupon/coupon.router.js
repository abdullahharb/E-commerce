import express from 'express'
import * as coupon from './coupon.controller.js'
import { validation } from '../../middleware/validation.js'
import { createCouponSchema, updateCouponSchema, getOrDeleteCouponSchema } from './coupon.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const couponRouter = express.Router()


couponRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'), validation(createCouponSchema), coupon.createCoupon)
    .get(coupon.getAllCoupons)

couponRouter.route('/:id')
    .get(coupon.getCoupon)
    .put(protectedRoutes, allowedTo('admin'), validation(updateCouponSchema), coupon.updateCoupon)
    .delete(protectedRoutes, allowedTo('admin'), validation(getOrDeleteCouponSchema), coupon.deleteCoupon)

export default couponRouter
