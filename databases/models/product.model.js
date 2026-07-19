import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
    title: {
        type: String,
        unique: [true, 'product title is unique'],
        trim: true,
        required: [true, 'product title is required'],
        minLength: [2, 'to short product name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    price: {
        type: Number,
        required: [true, 'product price required'],
        min: 0
    },
    priceAfterDiscount: {
        type: Number,
        min: 0
    },
    ratingAvg: {
        type: Number,
        default: 0,
        min: [0, 'Rating average cannot be negative'],
        max: [5, 'Rating average must be less than or equal to 5']
    },
    ratingCount: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        minLength: [5, 'to short product description'],
        maxLength: [300, 'to long product description'],
        required: [true, 'product description required'],
        trim: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0,
        required: [true, 'product quantity required']
    },
    sold: {
        type: Number,
        default: 0,
        min: 0
    },
    imgCover: String,
    images: [String],
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: [true, 'product category required'],
    },
    subcategory: {
        type: mongoose.Types.ObjectId,
        ref: 'subcategory',
        required: [true, 'product subcategory required']
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'brand',
        required: [true, 'product brand required']
    }

},
    {
        timestamps: true,

        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

productSchema.post('init', (doc) => {
    doc.imgCover = process.env.BASE_URL + "/product/" + doc.imgCover
    doc.images = doc.images.map((path) => process.env.BASE_URL + "/product/" + path)
});

// show reviews product
productSchema.virtual('MyReviews', {
    ref: 'review',
    localField: '_id',
    foreignField: 'product',
});

productSchema.pre(/^find/, function () {
    this.populate('MyReviews')
});


export const productModel = mongoose.model('product', productSchema)
