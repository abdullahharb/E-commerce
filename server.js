
import express from 'express'
import * as dotenv from 'dotenv'
import { catchAsyncError } from './src/middleware/catchAsyncError.js'
import { dbconnection } from './databases/dbConnection.js'
import { init } from './src/modules/index.route.js'
import cors from 'cors'


import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

import { cartModel } from './databases/models/cart.model.js'
import { orderModel } from './databases/models/order.model.js'


// import morgan from "morgan"
dotenv.config({ quiet: true })
const app = express()

// app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.static('uploads'))

init(app)
dbconnection()


app.post('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }), catchAsyncError(async (req, res) => {
    const sig = req.headers['stripe-signature'];

    const event = await Promise.resolve().then(() =>
        stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    );

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const shippingAddress = session.metadata;
        const totalOrderPrice = session.amount_total / 100;

        const cart = await cartModel.findOne({ user: userId });

        if (cart) {
            await orderModel.create({
                user: userId,
                cartItems: cart.cartItems,
                totalOrderPrice,
                shippingAddress,
                paymentMethodType: 'card',
                isPaid: true,
                paidAt: Date.now()
            });

            cart.cartItems = []
            cart.totalPrice = 0
            cart.totalPriceAfterDiscount = undefined
            cart.discount = undefined
            await cart.save()
        }
    }

    return res.status(200).json({ received: true });
}))


app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running...`)
})


process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err);
})


