import joi from "joi";

export const createCartSchema = joi.object({
    product: joi.string().hex().length(24).required(),
    quantity: joi.number().integer().min(1)
})

export const updateQuantitySchema = joi.object({
    id: joi.string().hex().length(24).required(),
    quantity: joi.number().integer().min(1).required()
})

export const removeCartSchema = joi.object({
    id: joi.string().hex().length(24).required()
})

export const applyCouponSchema = joi.object({
    code: joi.string().required().trim()
})
