const Joi = require('joi');

const transportSchema = Joi.object().keys({
    name: Joi.string().required().messages({
        'string.base': 'Name must be of type string',
        'string.empty': 'Name is a required field'
    }),
    capacity: Joi.number().greater(0).required().messages({
        'number.base': 'Capacity must be of type number',
        'number.greater': 'Capacity must be greater than 0',
        'number.empty': 'Capacity is a required field'
    }),
    brand: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    image: Joi.string().optional()
});

const updateTransportSchema = Joi.object().keys({
    name: Joi.string().optional(),
    capacity: Joi.number().greater(0).optional(),
    brand: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    image: Joi.string().optional()
});

module.exports = {
    transportSchema,
    updateTransportSchema
}