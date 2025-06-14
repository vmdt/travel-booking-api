const Joi = require('joi');

const signupSchema = Joi.object().keys({
    username: Joi.string().min(4).max(12).required().messages({
        'string.base': 'Username must be of type string',
        'string.min': 'Username must be at least 4 of characters',
        'string.max': 'Username must be under 12 of characters',
        'string.empty': 'Username is a required field'
    }),
    password: Joi.string().min(8).max(16).required().messages({
        'string.base': 'Password must be of type string',
        'string.min': 'Password must be at least 8 of characters',
        'string.max': 'Password must be under 16 of characters',
        'string.empty': 'Password is a required field'
    }),
    passwordConfirm: Joi.any().equal(Joi.ref('password')).required().messages({
        'any.only': 'Password Confirmation does not match'
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email must be of type string',
        'string.email': 'Invalid email',
        'string.empty': 'Email is a required field'
    }),
    fullname: Joi.string().min(2).max(50).required().messages({
        'string.base': 'Full name must be of type string',
        'string.min': 'Full name must be at least 2 of characters',
        'string.max': 'Full name must be under 50 of characters',
        'string.empty': 'Full name is a required field'
    }),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).required().messages({
        'string.base': 'Phone number must be of type string',
        'string.pattern.base': 'Phone number must be 10 or 11 digits',
        'string.empty': 'Phone number is a required field',
    })
});

module.exports = signupSchema;