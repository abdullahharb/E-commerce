import joi from "joi";

export const createSubCategorySchema = joi.object({
    name: joi.string().min(2).required(),
    category: joi.string().hex().length(24).required()
})

export const updateSubCategorySchema = joi.object({
    id: joi.string().hex().length(24).required(),
    name: joi.string().min(2).optional(),
    category: joi.string().hex().length(24),
})

export const getOrDeleteSubCategorySchema = joi.object({
    id: joi.string().hex().length(24).required()
})
