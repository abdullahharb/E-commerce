
import { reviewModel } from "../../../databases/models/review.model.js"
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"
import * as factor from "../handlers/factor.handler.js"

const createReview = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user._id
    let isReview = await reviewModel.findOne({ user: req.user._id, product: req.body.product })
    if (isReview) return next(new AppError('you are already add comment before', 409))
    let result = new reviewModel(req.body)
    await result.save()
    res.json({ message: 'sucess', result })
})

const getAllReviews = factor.getAll(reviewModel)


const getReview = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let result = await reviewModel.findById(id)
    !result && next(new AppError('Review not found', 404))
    result && res.json({ message: 'success', result })
})

const updateReview = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let result = await reviewModel.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { comment: req.body.comment, ratings: req.body.ratings },
        { returnDocument: 'after' })
    !result && next(new AppError('Review not found Or Your Not Outhorized To Perform This Action', 404))
    result && res.json({ message: 'success', result })
})

const deleteReview = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let result;

    if (req.user.role === 'admin') {
        result = await reviewModel.findOneAndDelete({ _id: id });
    } else {
        result = await reviewModel.findOneAndDelete({ _id: id, user: req.user._id });
    }
    if (!result) return next(new AppError('Review not found Or Your Not Authorized To Perform This Action', 404))
    res.json({ message: 'success', result })
})


export {
    createReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview
}
