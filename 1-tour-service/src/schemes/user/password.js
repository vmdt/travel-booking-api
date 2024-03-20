const Joi = require('joi');

const changePasswordSchema = Joi.object().keys({
    currentPassword: Joi.string().min(8).max(16).required().messages({
        'string.base': 'Current Password must be of type string',
        'string.min': 'Current Password must be at least 8 of characters',
        'string.max': 'Current Password must be under 16 of characters',
        'string.empty': 'Current Password is a required field'
    }),
    newPassword: Joi.string().min(8).max(16).required().messages({
        'string.base': 'New Password must be of type string',
        'string.min': 'New Password must be at least 8 of characters',
        'string.max': 'New Password must be under 16 of characters',
        'string.empty': 'New Password is a required field'
    }),
    newPasswordConfirm: Joi.any().equal(Joi.ref('newPassword')).required().messages({
        'any.only': 'New Password Confirmation does not match',
        'any.required': 'New Password Confirm is a required field'
    })
});

module.exports = {
    changePasswordSchema
}