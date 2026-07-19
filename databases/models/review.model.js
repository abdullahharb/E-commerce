import mongoose from 'mongoose'


const reviewSchema = mongoose.Schema({
    comment: {
        type: String,
        trim: true,
    },
    ratings: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'review ratings required']
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: [true, 'review product required']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: [true, 'review user required']
    }

}, { timestamps: true })


reviewSchema.pre(/^find/, function () {
    this.populate('user', 'name -_id')
})



export const reviewModel = mongoose.model('review', reviewSchema)
