import dotenv from 'dotenv';
dotenv.config({ quiet: true })

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

import { cartModel } from "../../../databases/models/cart.model.js"
import { orderModel } from "../../../databases/models/order.model.js"
import { productModel } from "../../../databases/models/product.model.js"
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"


const createCashOrder = catchAsyncError(async (req, res, next) => {

    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) return next(new AppError('Cart not found, please add items first', 404))

    for (const item of cart.cartItems) {
        const product = await productModel.findById(item.product);
        if (!product) return next(new AppError("Sorry, this product is no longer available", 404))
        if (product.quantity < item.quantity) {
            return next(new AppError(`Sorry, "${product.title}" does not have enough stock available`, 400))
        }
    }
    let totalOrderPrice = cart.totalPriceAfterDiscount ?
        cart.totalPriceAfterDiscount : cart.totalPrice

    let order = new orderModel({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress,
    })
    await order.save()
    if (order) {
        let options = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: item.quantity } }
            }
        }))
        await productModel.bulkWrite(options)

        // await cartModel.findByIdAndDelete(cart._id)

        cart.cartItems = []
        cart.totalPrice = 0
        cart.totalPriceAfterDiscount = undefined
        cart.discount = undefined

        await cart.save()

        return res.status(201).json({ message: 'success order', order })
    }

    return next(new AppError('failed to create order', 400))
})

const getUserOrder = catchAsyncError(async (req, res, next) => {
    let order = await orderModel.findOne({ user: req.user._id }).populate('cartItems.product')
    if (!order) return next(new AppError('No order found for this user', 404))
    return res.status(200).json({ message: "success", order })
})

const getAllOrders = catchAsyncError(async (req, res, next) => {
    let orders = await orderModel.find({}).populate('cartItems.product')
    if (!orders) return next(new AppError('No order found for this user', 404))
    return res.status(200).json({ message: "success", orders })
})




const createCheckOutSession = catchAsyncError(async (req, res, next) => {

    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) return next(new AppError('Cart not found, please add items first', 404))

    let totalOrderPrice = cart.totalPriceAfterDiscount ?
        cart.totalPriceAfterDiscount : cart.totalPrice

    let session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: totalOrderPrice * 100,
                    product_data: {
                        name: req.user.name
                    }
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/api/v1/orders/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/api/v1/orders/cancel`,
        client_reference_id: req.user._id.toString(),
        metadata: req.body.shippingAddress
    })

    return res.status(200).json({ message: "success", session });
})

export const getSuccessOrder = catchAsyncError(async (req, res, next) => {
    const sessionId = req.query.session_id;
    return res.status(200).json({ message: "Payment success", sessionId })
});

export const getCancelOrder = catchAsyncError(async (req, res, next) => {
    return res.status(200).json({ message: "Payment canceled by the user" })
});

export {
    createCashOrder,
    getUserOrder,
    getAllOrders,

    createCheckOutSession
}
