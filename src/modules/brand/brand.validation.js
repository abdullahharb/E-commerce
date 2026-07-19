import joi from "joi";

export const createBrandSchema = joi.object({
    name: joi.string().min(2).required()
})

export const updateBrandSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    name: joi.string().min(2)
})

export const getOrDeleteBrandSchema = joi.object({
    id: joi.string().hex().length(24).required()
})
