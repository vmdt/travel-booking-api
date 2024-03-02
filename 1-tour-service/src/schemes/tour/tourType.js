const Joi = require('joi');

const tourTypeSchema = Joi.object().keys({
    name: Joi.string().min(2).max(20).required().messages({
        'string.base': 'Field "name" must be of type string',
        'string.min': 'Invalid name',
        'string.max': 'Invalid name',
        'string.empty': 'Name is a required field'
    }),
    image: Joi.string().required().messages({
        'string.base': 'Image must be of type string',
        'string.empty': 'Image is a required field'
    }),
    icon: Joi.string().optional(),
    isActive: Joi.boolean().optional()
});

module.exports = tourTypeSchema;