import joi from "joi";
let phoneRegex = /^01[0125][0-9]{8}$/

export const createOrderSchema = joi.object({
    
    shippingAddress: joi.object({
        street: joi.string().required().trim(),
        city: joi.string().required().trim(),
        phone: joi.string().pattern(phoneRegex).required()
    }).required()

})

