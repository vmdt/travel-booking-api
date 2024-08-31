const Joi = require('joi');

const locationSchema = Joi.object().keys({
    title: Joi.string().required().messages({
        'string.base': 'Title must be of type string',
        'string.empty': 'Title is a required field'
    }),
    type: Joi.string().optional(),
    loc: Joi.object({
        type: Joi.string().optional(),
        coordinates: Joi.array().items(Joi.number())
    }).optional(),
    thumbnail: Joi.string().optional()
});

const updateLocationSchema = Joi.object().keys({
    title: Joi.string().optional(),
    type: Joi.string().optional(),
    loc: Joi.object({
        type: Joi.string().optional(),
        coordinates: Joi.array().items(Joi.number())
    }).optional(),
    thumbnail: Joi.string().optional()
});

module.exports = {
    locationSchema,
    updateLocationSchema
}