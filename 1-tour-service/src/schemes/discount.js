const Joi = require('joi');

const discountSchema = Joi.object().keys({
    name: Joi.string().optional(),
    code: Joi.string().min(6).max(15).required().messages({
        'string.min': 'Code must be at least 6 characters',
        'string.base': 'Code must be of type string',
        'string.max': 'Code must be under 15 characters',
        'string.empty': 'Code is a required field'
    }),
    value: Joi.number().greater(0).required(),
    appliesTo: Joi.string().required(),
    type: Joi.string().optional(),
    startDate: Joi.string().optional(),
    endDate: Joi.string().optional(),
    minOrder: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
    maxUses: Joi.number().optional(),
    tours: Joi.array().items(Joi.string()).optional()
});

const updateDiscountSchema = Joi.object().keys({
    name: Joi.string().optional(),
    code: Joi.string().optional(),
    value: Joi.number().greater(0).optional(),
    appliesTo: Joi.string().optional(),
    type: Joi.string().optional(),
    startDate: Joi.string().optional(),
    endDate: Joi.string().optional(),
    minOrder: Joi.number().optional(),
    maxUses: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
    tours: Joi.array().items(Joi.string()).optional()
});

const getAmountSchema = Joi.object().keys({
    code: Joi.string().required(),
    tours: Joi.array().items(Joi.object({
        tourId: Joi.string(),
        totalPrice: Joi.number().greater(0)
    }))
});

module.exports = {
    discountSchema,
    updateDiscountSchema,
    getAmountSchema
}