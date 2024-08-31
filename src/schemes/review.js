const Joi = require('joi');

const reviewSchema = Joi.object().keys({
    user: Joi.string().required(),
    tour: Joi.string().required(),
    rating: Joi.number().greater(0).required(),
    content: Joi.string(),
    reviewAt: Joi.string(),
    isHidden: Joi.boolean(),
    approve: Joi.boolean()
});

const updateReviewSchema = Joi.object().keys({
    user: Joi.string(),
    tour: Joi.string(),
    rating: Joi.number().greater(0),
    content: Joi.string(),
    reviewAt: Joi.string(),
    isHidden: Joi.boolean(),
    approve: Joi.boolean()
});

module.exports = {
    reviewSchema,
    updateReviewSchema
}