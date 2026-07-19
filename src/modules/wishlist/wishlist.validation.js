import joi from "joi";

export const addOrDeleteWishlistSchema = joi.object({
    product: joi.string().required().hex().length(24)
    .message('send product in the body and length 24')
})

