import joi from "joi";

const nameRegex = /^[a-zA-Z\u0600-\u06FF\s_]+$/
const phoneRegex = /^01[0125][0-9]{8}$/

export const createUserSchema = joi.object({
    name: joi.string().min(2).max(30).trim().pattern(nameRegex).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).required(),
    phone: joi.string().pattern(phoneRegex).required(),
    role: joi.string().valid('user', 'admin').optional(),
    ProfilePic: joi.string().optional()
})

export const updateUserOrChangePasswordSchema = joi.object({
    id: joi.string().hex().length(24).required(),
    name: joi.string().min(2).max(30).trim().pattern(nameRegex).optional(),
    email: joi.string().email().optional(),
    password: joi.string().min(6).max(30).optional(),
    phone: joi.string().pattern(phoneRegex).optional()
})

export const getOrDeleteUserSchema = joi.object({
    id: joi.string().hex().length(24).required()
})

