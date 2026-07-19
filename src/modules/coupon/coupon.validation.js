import joi from "joi";

export const createCouponSchema = joi.object({
    code: joi.string().min(2).required().trim(),
    discount: joi.number().min(0).max(90).required(),
    expires: joi.date().min('now').required()
});

export const updateCouponSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    code: joi.string().min(2).trim(),
    discount: joi.number().min(0).max(90),
    expires: joi.date().min('now')
})

export const getOrDeleteCouponSchema = joi.object({
    id: joi.string().hex().length(24).required()
})

