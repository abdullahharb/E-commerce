import joi from "joi";

export const createReviewSchema = joi.object({
    comment: joi.string().trim().min(3).max(500).optional(),
    ratings: joi.number().min(1).max(5).required(),
    product: joi.string().hex().length(24).required(),
})

export const updateReviewSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    comment: joi.string().trim().min(3).max(500),
    ratings: joi.number().min(1).max(5)
})

export const getOrDeleteReviewSchema = joi.object({
    id: joi.string().hex().length(24).required()
})

