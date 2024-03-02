const Joi = require('joi');

const addToCartSchema = Joi.object().keys({
    user: Joi.string().required(),
    status: Joi.string().optional(),
    tour: Joi.object({
        tour: Joi.string(),
        startDate: Joi.string(),
        startTime: Joi.string(),
        participants: Joi.array().items(Joi.object({
            title: Joi.string(),
            quantity: Joi.number().greater(0),
            price: Joi.number().greater(0),
            currency: Joi.string()
        }))
    })
});

const updateCartSchema = Joi.object().keys({
    user: Joi.string().optional(),
    tour: Joi.object({
        tour: Joi.string(),
        itemId: Joi.string(),
        startDate: Joi.string(),
        startTime: Joi.string(),
        participants: Joi.array().items(Joi.object({
            title: Joi.string(),
            quantity: Joi.number().greater(0),
            price: Joi.number().greater(0),
            currency: Joi.string()
        }))
    })
});

const deleteItemSchema = Joi.object().keys({
    user: Joi.string().optional(),
    itemId: Joi.string().optional()
});

module.exports = {
    addToCartSchema,
    updateCartSchema,
    deleteItemSchema
}