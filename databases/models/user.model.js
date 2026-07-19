import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'user name required'],
        minLength: [2, 'too short user name']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'email required'],
        minLength: 1,
        unique: [true, 'email must be unique'],
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'minLength 6 characters']
    },
    passwordChangedAt: Date,
    loggedOutAt: Date,

    phone: {
        type: String,
        required: [true, 'phone number required']
    },

    ProfilePic: String,

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    },

    wishlist: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'product'
    }],
    addresses: [{
        name: String,
        phone: String,
        city: String,
        street: String
    }],

}, { timestamps: true })

// hashpassword => create User
userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, Number(process.env.ROUND))
})

// hashpassword => update User
userSchema.pre('findOneAndUpdate', function () {
    if (this._update.password)
        this._update.password = bcrypt.hashSync(this._update.password, Number(process.env.ROUND))
})

export const userModel = mongoose.model('user', userSchema)
