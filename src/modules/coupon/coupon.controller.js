import { couponModel } from "../../../databases/models/coupon.model.js"
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"
import * as factor from "../handlers/factor.handler.js"
import qrcode from 'qrcode'

const createCoupon = catchAsyncError(async (req, res, next) => {
    let result = new couponModel(req.body)
    await result.save()
    res.json({ message: 'sucess', result })
})


const getAllCoupons = factor.getAll(couponModel)


const getCoupon = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let result = await couponModel.findById(id)
    if (!result) return next(new AppError('Coupon not found', 404))
    let urlCoupon = await qrcode.toDataURL(result.code)
    res.json({ message: 'success', result, urlCoupon })
})

const updateCoupon = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let result = await couponModel.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })
    !result && next(new AppError('Coupon not found', 404))
    result && res.json({ message: 'success', result })
})

const deleteCoupon = factor.deleteOne(couponModel)

export {
    createCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
}
