const Joi = require('joi');

const locationSchema = Joi.object().keys({
    name: Joi.string().required().messages({
        'string.base': 'Name must be of type string',
        'string.empty': 'Name is a required field'
    }),
    type: Joi.string().optional(),
    loc: Joi.object({
        type: Joi.string().optional(),
        coordinates: Joi.array().items(Joi.number())
    }).optional()
});

const updateLocationSchema = Joi.object().keys({
    name: Joi.string().optional(),
    type: Joi.string().optional(),
    loc: Joi.object({
        type: Joi.string().optional(),
        coordinates: Joi.array().items(Joi.number())
    }).optional()
});

module.exports = {
    locationSchema,
    updateLocationSchema
}