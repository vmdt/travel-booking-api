const Joi = require("joi");

const tourSchema = Joi.object().keys({
	code: Joi.string().min(4).max(20).required().messages({
		"string.base": "Tour Code must be of type string",
		"string.min": "Invalid code",
		"string.max": "Invalid code",
		"string.empty": "Tour Code is a required field",
	}),
	title: Joi.string().min(4).required().messages({
		"string.base": "Tour Title must be of type string",
		"string.min": "Invalid title",
		"string.empty": "Tour Title is a required field",
	}),
	summary: Joi.string().optional(),
	highlights: Joi.array().items(Joi.string()).optional(),
	thumbnail: Joi.string().optional(),
	description: Joi.string().optional(),
	images: Joi.array().items(Joi.string()).optional(),
	category: Joi.string().messages({
		"string.base": "Category must be type string of object id",
	}),
	interest: Joi.string().messages({
		"string.base": "Interest must be type string of object id",
	}),
	startLocation: Joi.object({
		type: Joi.string().optional(),
		coordinates: Joi.array().items(Joi.number()).optional(),
		description: Joi.string().optional(),
		address: Joi.string().optional(),
	}).optional(),
	details: Joi.array()
		.items(
			Joi.object({
				title: Joi.string(),
				description: Joi.string(),
			}),
		)
		.optional(),
	inclusions: Joi.array().items(Joi.string()).optional(),
	exclusions: Joi.array().items(Joi.string()).optional(),
	itinerary: Joi.array()
		.items(
			Joi.object({
				activity: Joi.string(),
				description: Joi.string(),
				address: Joi.string(),
				duration: Joi.number().greater(0),
				location: Joi.object({
					type: Joi.string().optional(),
					coordinates: Joi.array().items(Joi.number()).optional(),
				}).optional(),
				icon: Joi.string(),
			}),
		)
		.optional(),
	regularPrice: Joi.number().greater(0).required().messages({
		"number.base": "Regular Price must be of type number",
		"number.greater": "Invalid regular price",
		"number.required": "Regular price is a required field",
	}),
	discountPrice: Joi.number().greater(0).optional(),
	discountPercentage: Joi.number().greater(0).optional(),
	duration: Joi.number().greater(0).optional(),
	numOfRating: Joi.number().greater(0).optional(),
	ratingAverage: Joi.number().greater(0).optional(),
	currency: Joi.string().optional(),
	priceOptions: Joi.array()
		.items(
			Joi.object({
				title: Joi.string(),
				participantsCategoryIdentifier: Joi.string(),
				value: Joi.number().greater(0),
				currency: Joi.string(),
			}),
		)
		.optional(),
	locations: Joi.array().items(Joi.string()).optional(),
	transports: Joi.array().items(Joi.string()).optional(),
	hotels: Joi.array().items(Joi.string()).optional(),
});

const updateTourSchema = Joi.object().keys({
	code: Joi.string().optional(),
	title: Joi.string().optional(),
	summary: Joi.string().optional(),
	highlights: Joi.array().items(Joi.string()).optional(),
	description: Joi.string().optional(),
	thumbnail: Joi.string().optional(),
	images: Joi.array().items(Joi.string()).optional(),
	category: Joi.string().optional(),
	interest: Joi.string().optional(),
	startLocation: Joi.object({
		type: Joi.string().optional(),
		coordinates: Joi.array().items(Joi.number()).optional(),
		description: Joi.string().optional(),
		address: Joi.string().optional(),
	}).optional(),
	details: Joi.array()
		.items(
			Joi.object({
				title: Joi.string(),
				description: Joi.string(),
			}),
		)
		.optional(),
	inclusions: Joi.array().items(Joi.string()).optional(),
	exclusions: Joi.array().items(Joi.string()).optional(),
	itinerary: Joi.array()
		.items(
			Joi.object({
				activity: Joi.string(),
				description: Joi.string(),
				address: Joi.string(),
				duration: Joi.number().greater(0),
				coordinates: Joi.array().items(Joi.number()),
				icon: Joi.string(),
			}),
		)
		.optional(),
	regularPrice: Joi.number().greater(0).optional(),
	discountPrice: Joi.number().greater(0).optional(),
	discountPercentage: Joi.number().greater(0).optional(),
	duration: Joi.number().greater(0).optional(),
	numOfRating: Joi.number().greater(0).optional(),
	ratingAverage: Joi.number().greater(0).optional(),
	currency: Joi.string().optional(),
	priceOptions: Joi.array()
		.items(
			Joi.object({
				title: Joi.string(),
				participantsCategoryIdentifier: Joi.string(),
				value: Joi.number().greater(0),
				currency: Joi.string(),
			}),
		)
		.optional(),
	locations: Joi.array().items(Joi.string()).optional(),
	transports: Joi.array().items(Joi.string()).optional(),
	hotels: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
	tourSchema,
	updateTourSchema,
};
