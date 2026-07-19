import express from 'express'
import * as brand from './brand.controller.js'
import { validation } from '../../middleware/validation.js'
import { createBrandSchema, updateBrandSchema, getOrDeleteBrandSchema } from './brand.validation.js'
import { uploadSingleFile } from '../../middleware/upload.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const brandRouter = express.Router()


brandRouter.route('/')
    .post(protectedRoutes,allowedTo('admin','user'),uploadSingleFile('logo', 'brand'), validation(createBrandSchema), brand.createBrand)
    .get(brand.getAllBrands)

brandRouter.route('/:id')
    .get(validation(getOrDeleteBrandSchema), brand.getBrand)
    .put(protectedRoutes,allowedTo('admin'),uploadSingleFile('logo', 'brand'), validation(updateBrandSchema), brand.updateBrand)
    .delete(protectedRoutes,allowedTo('admin'),validation(getOrDeleteBrandSchema), brand.deleteBrand)

export default brandRouter
