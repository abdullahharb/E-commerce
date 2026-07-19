import { cartModel } from "../../../databases/models/cart.model.js"
import { couponModel } from "../../../databases/models/coupon.model.js"
import { productModel } from "../../../databases/models/product.model.js"
import { catchAsyncError } from "../../middleware/catchAsyncError.js"
import { AppError } from "../../utils/AppError.js"
import * as factor from "../handlers/factor.handler.js"

function calcTotalPrice(carts) {
    let total = 0;
    carts.cartItems.forEach(elm => {
        total += elm.quantity * elm.price
    })
    carts.totalPrice = total
}

const addProductToCart = catchAsyncError(async (req, res, next) => {
    let product = await productModel.findById(req.body.product)
    if (!product) return next(new AppError('product not found', 401))
    req.body.price = product.price
    req.body.quantity = req.body.quantity || 1

    let isCartExist = await cartModel.findOne({ user: req.user._id })
    if (!isCartExist) {
        let cart = new cartModel({ user: req.user._id, cartItems: [req.body] })
        calcTotalPrice(cart)
        await cart.save()
        return res.json({ message: 'sucess', cart })
    }
    let item = isCartExist.cartItems.find(elm => elm.product == req.body.product)
    if (item) {
        item.quantity += req.body.quantity
    } else {
        isCartExist.cartItems.push(req.body);
    }
    calcTotalPrice(isCartExist)

    if (isCartExist.discount) {
        isCartExist.totalPriceAfterDiscount = isCartExist.totalPrice - (isCartExist.totalPrice * isCartExist.discount) / 100
    }

    await isCartExist.save()
    return res.json({ message: ' success add to cart', cart: isCartExist })
})

const removeProductFromCart = catchAsyncError(async (req, res, next) => {
    let result = await cartModel.findOneAndUpdate({ user: req.user._id },
        { $pull: { cartItems: { _id: req.params.id } } },
        { returnDocument: 'after' })
    if (!result) return next(new AppError('item not found', 404))

    calcTotalPrice(result)
    if (result.discount) {
        result.totalPriceAfterDiscount = result.totalPrice - (result.totalPrice * result.discount) / 100
    }
    await result.save()
    res.json({ message: 'success remove from cart', cart: result })
})

const updateQuantity = catchAsyncError(async (req, res, next) => {
    let product = await productModel.findById(req.params.id)
    if (!product) return next(new AppError('product not found', 401))

    let isCartExist = await cartModel.findOne({ user: req.user._id })
    if (!isCartExist) return next(new AppError('cart not found', 404))

    let item = isCartExist.cartItems.find(elm => elm.product == req.params.id)
    if (!item) return next(new AppError('item not found in cart', 404))
    item.quantity = req.body.quantity

    calcTotalPrice(isCartExist)

    if (isCartExist.discount) {
        isCartExist.totalPriceAfterDiscount = isCartExist.totalPrice - (isCartExist.totalPrice * isCartExist.discount) / 100
    }

    await isCartExist.save()
    return res.json({ message: ' success update quantity', cart: isCartExist })
})

const getLoggedUserCart = catchAsyncError(async (req, res, next) => {
    let isCart = await cartModel.findOne({ user: req.user._id }).populate('cartItems.product')
    if (!isCart) return next(new AppError('you not add cart', 401))
    calcTotalPrice(isCart)
    return res.json({ message: ' success ', cart: isCart })
})

const applyCoupon = catchAsyncError(async (req, res, next) => {

    let coupon = await couponModel.findOne({ code: req.body.code, expires: { $gt: Date.now() } })
    if (!coupon) return next(new AppError('Invalid or expired coupon', 400));

    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) return next(new AppError('Cart not found, please add items first', 404));

    cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * coupon.discount) / 100
    cart.discount = coupon.discount

    await cart.save()
    return res.status(200).json({ message: ' success, coupon applied ', cart })
})


export {
    addProductToCart,
    removeProductFromCart,
    updateQuantity,
    getLoggedUserCart,
    applyCoupon
}

