import express from 'express'
import * as review from './review.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validation } from '../../middleware/validation.js'
import { createReviewSchema, updateReviewSchema, getOrDeleteReviewSchema } from './review.validation.js'


const ReviewRouter = express.Router()


ReviewRouter.route('/')
    .post(protectedRoutes, allowedTo('user'), validation(createReviewSchema), review.createReview)
    .get(review.getAllReviews)

ReviewRouter.route('/:id')
    .get(validation(getOrDeleteReviewSchema), review.getReview)
    .put(protectedRoutes, allowedTo('user'), validation(updateReviewSchema), review.updateReview)
    .delete(protectedRoutes, allowedTo('admin', 'user'), validation(getOrDeleteReviewSchema), review.deleteReview)

export default ReviewRouter
