import express from 'express'
import * as wishlist from './wishlist.controller.js'
import { validation } from '../../middleware/validation.js'
import { addOrDeleteWishlistSchema } from './wishlist.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const wishlistRouter = express.Router()

wishlistRouter.route('/')
    .patch(protectedRoutes, allowedTo('user'), validation(addOrDeleteWishlistSchema), wishlist.addToWishlist)
    .delete(protectedRoutes, allowedTo('user'), validation(addOrDeleteWishlistSchema), wishlist.deleteFromWishlist)
    .get(protectedRoutes, allowedTo('user'), wishlist.getAllUserWishlist)

export default wishlistRouter
