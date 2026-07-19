import joi from "joi";

let phoneRegex = /^01[0125][0-9]{8}$/

export const addAddressesSchema = joi.object({
    name: joi.string().min(2).max(50).required().trim(),
    phone: joi.string().pattern(phoneRegex).required().trim(),
    city: joi.string().trim().required(),
    street: joi.string().trim().required()
})

export const DeleteAddressesSchema = joi.object({
    address: joi.string().required().hex().length(24).message('send address in the body and length 24')
})
