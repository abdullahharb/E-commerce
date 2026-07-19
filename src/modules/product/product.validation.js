import joi from "joi";

export const createProductSchema = joi.object({
    title: joi.string().min(2).required().trim(),
    price: joi.number().min(0).required(),
    priceAfterDiscount: joi.number().min(0).max(joi.ref('price')),
    description: joi.string().min(5).max(300).required().trim(),
    quantity: joi.number().min(0).required(),

    category: joi.string().hex().length(24).required(),
    subcategory: joi.string().hex().length(24).required(),
    brand: joi.string().hex().length(24).required()
})

export const updateProductSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    title: joi.string().min(2).trim(),
    price: joi.number().min(0),
    priceAfterDiscount: joi.number().min(0).max(joi.ref('price')),
    description: joi.string().min(5).max(300).trim(),
    quantity: joi.number().min(0),

    category: joi.string().hex().length(24),
    subcategory: joi.string().hex().length(24),
    brand: joi.string().hex().length(24)
})

export const getOrDeleteProductSchema = joi.object({
    id: joi.string().hex().length(24).required()
})
