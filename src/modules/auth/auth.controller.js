import jwt from 'jsonwebtoken'
import { userModel } from '../../../databases/models/user.model.js'
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"
import bcrypt from 'bcrypt'

export const signUp = catchAsyncError(async (req, res, next) => {
    let isFound = await userModel.findOne({ email: req.body.email })
    if (isFound) return next(new AppError('email already exist', 409))

    let result = new userModel(req.body)
    await result.save()
    res.json({ message: 'success', result })
})

export const signIn = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    let user = await userModel.findOne({ email })
    if (!user) return next(new AppError('incorrect email or password', 401))
    const match = await bcrypt.compare(password, user.password)
    if (match) {
        let token = jwt.sign({ name: user.name, userId: user._id, role: user.role }, process.env.JWT_KEY)
        return res.json({ message: 'success login', token })
    }
    next(new AppError('incorrect Email or Password', 401))
})


export const protectedRoutes = catchAsyncError(async (req, res, next) => {
    let { token } = req.headers
    if (!token) return next(new AppError('token not provided', 401))

    let decoded = await jwt.verify(token, process.env.JWT_KEY)
    let user = await userModel.findById(decoded.userId)
    if (!user) return next(new AppError('token invalid because user not found', 401))

    if (user.passwordChangedAt) {
        let changePasswordDate = parseInt(user.passwordChangedAt.getTime() / 1000)
        if (changePasswordDate > decoded.iat) {
            return next(new AppError('password changed', 401))
        }
    }
    req.user = user
    next()
})


export const allowedTo = (...roles) => {

    return catchAsyncError(async (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new AppError('not Authorized. you are ' + req.user.role), 401)
        next()
    })

}
