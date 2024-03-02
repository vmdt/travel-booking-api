const Joi = require('joi');

const bookingSchema = Joi.object().keys({
    discountCode: Joi.string().optional(),
    cart: Joi.string().required(),
    personalInfo: Joi.object().optional(),
    tours: Joi.array().items(Joi.string()).optional()
});

module.exports = {
    bookingSchema
}