const Joi = require('joi');

const signupSchema = Joi.object().keys({
    username: Joi.string().min(4).max(12).required().messages({
        'string.base': 'Username must be of type string',
        'string.min': 'Invalid username',
        'string.max': 'Invalid username',
        'string.empty': 'Username is a required field'
    }),
    password: Joi.string().min(8).max(16).required().messages({
        'string.base': 'Password must be of type string',
        'string.min': 'Invalid password',
        'string.max': 'Invalid password',
        'string.empty': 'Password is a required field'
    }),
    passwordConfirm: Joi.any().equal(Joi.ref('password')).required().messages({
        'any.only': 'Password Confirmation does not match'
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email must be of type string',
        'string.email': 'Invalid email',
        'string.empty': 'Email is a required field'
    })
});

module.exports = signupSchema;