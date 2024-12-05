const Joi = require("joi");

const getRevenueSchema = Joi.object().keys({
	startDate: Joi.string()
		.pattern(/^(\d{4})?(-\d{2})?(-\d{2})?$/)
		.required(),
	endDate: Joi.string()
		.pattern(/^(\d{4})?(-\d{2})?(-\d{2})?$/)
		.required(),
	period: Joi.string().optional(),
});

module.exports = {
	getRevenueSchema,
};
