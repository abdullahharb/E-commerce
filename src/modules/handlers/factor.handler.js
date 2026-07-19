import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { ApiFeatures } from "../../utils/ApiFeatures.js"
import { AppError } from "../../utils/AppError.js"

export const deleteOne = (model) => {
    return catchAsyncError(async (req, res, next) => {
        const { id } = req.params
        let result = await model.findByIdAndDelete(id)
        !result && next(new AppError('Document not found', 404))
        result && res.json({ message: 'success', result })
    })
}

export const getAll = (model) => {
    return catchAsyncError(async (req, res, next) => {

        let apiFeatures = new ApiFeatures(model.find(), req.query)
            .paginate().filter().sort().search().fields()
        //excute query
        let result = await apiFeatures.mongooseQuery
        res.status(200).json({ message: 'success', page: apiFeatures.page, result })
    })
}


