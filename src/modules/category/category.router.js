import express from 'express'
import * as category from './category.controller.js'
import subcategoryRouter from '../subcategory/subcategory.router.js'
import { validation } from '../../middleware/validation.js'
import * as validated from './category.validation.js'
import { uploadSingleFile } from '../../middleware/upload.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const categoryRouter = express.Router()

categoryRouter.use('/:categoryId/subcategories', validation(validated.categoryIdParamSchema), subcategoryRouter)

categoryRouter.route('/')
    .post(protectedRoutes, allowedTo('admin', 'user'), uploadSingleFile('image', 'category'), validation(validated.createCategorySchema), category.createCategory)
    .get(category.getAllCategories)

categoryRouter.route('/:id')
    .get(validation(validated.getOrDeleteCategorySchema), category.getCategory)
    .put(protectedRoutes, allowedTo('admin'), uploadSingleFile('image', 'category'), validation(validated.updateCategorySchema), category.updateCategory)
    .delete(protectedRoutes, allowedTo('admin'), validation(validated.getOrDeleteCategorySchema), category.deleteCategory)

export default categoryRouter
