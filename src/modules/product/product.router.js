import express from 'express'
import * as product from './product.controller.js'
import { validation } from '../../middleware/validation.js'
import { createProductSchema, getOrDeleteProductSchema, updateProductSchema } from './product.validation.js'
import { uploadMixOffFiles } from '../../middleware/upload.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
let fieldsArray = [{ name: 'imgCover', maxCount: 1 }, { name: 'images', maxCount: 10 }]

const productRouter = express.Router()

productRouter.route('/')
    .post(protectedRoutes,allowedTo('admin','user'),uploadMixOffFiles(fieldsArray, 'product'), validation(createProductSchema), product.createProduct)
    .get(product.getAllProducts)

productRouter.route('/:id')
    .get(validation(getOrDeleteProductSchema), product.getProduct)
    .put(protectedRoutes,allowedTo('admin'),uploadMixOffFiles(fieldsArray, 'product'), validation(updateProductSchema), product.updateProduct)
    .delete(protectedRoutes,allowedTo('admin'),validation(getOrDeleteProductSchema), product.deleteProduct)

export default productRouter
