const Joi = require('joi');

const profileSchema = Joi.object().keys({
    fullname: Joi.string().min(2).max(20).messages({
        'string.base': 'Fullname must be of type string',
        'string.min': 'Fullname must be at least 2 characters',
        'string.max': 'Fullname must be under 20 characters'
    }).optional(),
    isActive: Joi.boolean().optional(),
    gender: Joi.string().optional(),
    dateOfBirth: Joi.string().optional(),
    address: Joi.string().optional(),
    nationality: Joi.string().optional(),
    phone: Joi.string().optional(),
    passport: Joi.string().optional(),
    dateOfIssuePassport: Joi.string().optional(),
    dateOfExpirationPassport: Joi.string().optional(),
    profilePicture: Joi.string().optional(),
    username: Joi.string().optional(),
    email: Joi.string().optional().email(),
    role: Joi.string().optional(),
    typeAuth: Joi.string().optional()
});

module.exports = profileSchema;