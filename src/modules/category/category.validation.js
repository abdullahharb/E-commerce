import joi from "joi";

export const createCategorySchema = joi.object({
    name: joi.string().min(2).required()
})

export const updateCategorySchema = joi.object({
    id: joi.string().hex().length(24).required(),
    name: joi.string().min(2)
})

export const getOrDeleteCategorySchema = joi.object({
    id: joi.string().hex().length(24).required()
})

export const categoryIdParamSchema = joi.object({
    categoryId: joi.string().hex().length(24).required()
})
