import { userModel } from "../../../databases/models/user.model.js"
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"

const addAddress = catchAsyncError(async (req, res, next) => {
    let result = await userModel.findByIdAndUpdate(req.user._id,
        { $addToSet: { addresses: req.body } }, { returnDocument: 'after' })
    if (!result) return next(new AppError('user not found', 404))
    res.json({ message: 'success', result: result.addresses })
})

const removeAddress = catchAsyncError(async (req, res, next) => {
    let result = await userModel.findOneAndUpdate({ _id: req.user._id },
        { $pull: { addresses: { _id: req.body.address } } }, { returnDocument: 'after' })
    if (!result) return next(new AppError('user or address not found', 404))
    res.json({ message: 'success', result: result.addresses })
})

const getAllUserAddress = catchAsyncError(async (req, res, next) => {
    let result = await userModel.findOne({ _id: req.user._id })
    if (!result) return next(new AppError('user not found', 404))
    res.json({ message: 'success', result: result.addresses })
})


export {
    addAddress,
    removeAddress,
    getAllUserAddress
}
