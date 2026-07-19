import { subcategoryModel } from '../../../databases/models/subcategory.model.js'
import slugify from 'slugify'
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"
import * as factor from '../handlers/factor.handler.js'

const createSubCategory = catchAsyncError(async (req, res, next) => {
    const { name, category } = req.body
    let result = new subcategoryModel({ name, category, slug: slugify(name) })
    await result.save()
    res.json({ message: 'sucess', result })
})

const getAllSubCategories = catchAsyncError(async (req, res, next) => {
    let filter = {}
    if (req.params.categoryId) {
        filter = { category: req.params.categoryId }
    }
    let result = await subcategoryModel.find(filter)
    res.json({ message: 'success', result })
})

const getSubCategory = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let result = await subcategoryModel.findById(id)
    !result && next(new AppError('subcategory not found', 404))
    result && res.json({ message: 'success', result })
})

const updateSubCategory = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const { name, category } = req.body

    let result = await subcategoryModel.findByIdAndUpdate(id,
        { name, category, slug: slugify(name) },
        { new: true })
    !result && next(new AppError('subcategory not found', 404))
    result && res.json({ message: 'success', result })
})

const deleteSubCategory = factor.deleteOne(subcategoryModel)

export {
    createSubCategory,
    getAllSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
}
