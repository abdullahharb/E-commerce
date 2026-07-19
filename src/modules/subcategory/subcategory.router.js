import express from 'express'
import * as subcategory from './subcategory.controller.js'
import { validation } from '../../middleware/validation.js'
import * as validated from './subcategory.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const subcategoryRouter = express.Router({ mergeParams: true })

subcategoryRouter.route('/')
    .post(protectedRoutes, allowedTo('admin','user'), validation(validated.createSubCategorySchema), subcategory.createSubCategory)
    .get(subcategory.getAllSubCategories)

subcategoryRouter.route('/:id')
    .get(validation(validated.getOrDeleteSubCategorySchema), subcategory.getSubCategory)
    .put(protectedRoutes, allowedTo('admin'), validation(validated.updateSubCategorySchema), subcategory.updateSubCategory)
    .delete(protectedRoutes, allowedTo('admin'), validation(validated.getOrDeleteSubCategorySchema), subcategory.deleteSubCategory)

export default subcategoryRouter
