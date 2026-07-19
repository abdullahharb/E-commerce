import { brandModel } from "../../../databases/models/brand.model.js"
import slugify from 'slugify'
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"
import * as factor from "../handlers/factor.handler.js"

const createBrand = catchAsyncError(async (req, res, next) => {
    req.body.slug = slugify(req.body.name)
    req.body.logo = req.file.filename
    let result = new brandModel(req.body)
    await result.save()
    res.json({ message: 'sucess', result })
})

const getAllBrands = factor.getAll(brandModel)


const getBrand = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let result = await brandModel.findById(id)
    !result && next(new AppError('Brand not found', 404))
    result && res.json({ message: 'success', result })
})

const updateBrand = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    if (req.body.name) req.body.slug = slugify(req.body.name)
    if (req.file) req.body.logo = req.file.filename
    
    let result = await brandModel.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })
    !result && next(new AppError('Brand not found', 404))
    result && res.json({ message: 'success', result })
})

const deleteBrand = factor.deleteOne(brandModel)

export {
    createBrand,
    getAllBrands,
    getBrand,
    updateBrand,
    deleteBrand
}
