import mongoose from 'mongoose'

const subcategorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name is required'],
        trim: true,
        required: true,
        minLength: [2, 'name is small'],
    },
    slug: {
        type: String,
        lowercase: true,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: [true, 'Category is required']
    }
}, { timestamps: true })

export const subcategoryModel = mongoose.model('subcategory', subcategorySchema)

