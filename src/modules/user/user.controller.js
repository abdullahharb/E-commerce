import { userModel } from '../../../databases/models/user.model.js'
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"
import * as factor from "../handlers/factor.handler.js"

const createUser = catchAsyncError(async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.email })
    if (user) return next(new AppError('email already exist', 409))
    let result = new userModel(req.body)
    await result.save()
    res.json({ message: 'success', result })
})


const getAllUsers = factor.getAll(userModel)


const getUser = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let result = await userModel.findById(id)
    !result && next(new AppError('User not found', 404))
    result && res.json({ message: 'success', result })
})

const updateUser = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let result = await userModel.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })
    !result && next(new AppError('User not found', 404))
    result && res.json({ message: 'success', result })
})


const deleteUser = factor.deleteOne(userModel)


const changeUserPassword = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    req.body.passwordChangedAt = Date.now()

    let result = await userModel.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })
    !result && next(new AppError('User not found', 404))
    result && res.json({ message: 'success', result })
})

const changeUserRole = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let result = await userModel.findByIdAndUpdate(id, { role: req.body.role }, { returnDocument: 'after' });
    !result && next(new AppError('User not found', 404));
    result && res.json({ message: 'success', result });
});


export {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,

    changeUserPassword,
    changeUserRole
}
