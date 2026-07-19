import { productModel } from "../../../databases/models/product.model.js"
import { userModel } from "../../../databases/models/user.model.js"
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"

const addToWishlist = catchAsyncError(async (req, res, next) => {
    const { product } = req.body
    let isProductExist = await productModel.findById(product)
    if (!isProductExist) return next(new AppError('product not found', 404))
    let result = await userModel.findByIdAndUpdate(req.user._id,
        { $addToSet: { wishlist: product } }, { returnDocument: 'after' })

    !result && next(new AppError('user or product not found', 404))
    result && res.json({ message: 'success', result: result.wishlist })
})

const deleteFromWishlist = catchAsyncError(async (req, res, next) => {
    const { product } = req.body
    let result = await userModel.findOneAndUpdate({ _id: req.user._id, wishlist: product },
        { $pull: { wishlist: product } }, { returnDocument: 'after' })

    !result && next(new AppError('user or product not found', 404))
    result && res.json({ message: 'success', result: result.wishlist })
})

const getAllUserWishlist = catchAsyncError(async (req, res, next) => {
    let result = await userModel.findOne({ _id: req.user._id }).populate('wishlist')
    !result && next(new AppError('user or product not found', 404))
    result && res.json({ message: 'success', result: result.wishlist })
})


export {
    addToWishlist,
    deleteFromWishlist,
    getAllUserWishlist
}
