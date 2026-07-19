import { productModel } from '../../../databases/models/product.model.js'
import slugify from 'slugify'
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"
import * as factor from "../handlers/factor.handler.js"

const createProduct = catchAsyncError(async (req, res, next) => {
    req.body.slug = slugify(req.body.title)
    req.body.imgCover = req.files.imgCover[0].filename
    req.body.images = req.files.images.map(obj => obj.filename)

    let result = new productModel(req.body)
    await result.save()
    res.json({ message: 'sucess', result })
})

const getAllProducts = factor.getAll(productModel)

const getProduct = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let result = await productModel.findById(id)
    !result && next(new AppError('Product not found', 404))
    result && res.json({ message: 'success', result })
})

const updateProduct = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    if (req.body.title) req.body.slug = slugify(req.body.title)

    if (req.files && req.files.imgCover) req.body.imgCover = req.files.imgCover[0].filename;
    if (req.files && req.files.images) req.body.images = req.files.images.map(obj => obj.filename);

    let result = await productModel.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })
    !result && next(new AppError('Product not found', 404))
    result && res.json({ message: 'success', result })
})

const deleteProduct = factor.deleteOne(productModel)

export {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct
}
