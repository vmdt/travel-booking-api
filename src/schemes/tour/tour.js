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
	type: Joi.string().optional(),
	summary: Joi.string().optional(),
	highlights: Joi.array().items(Joi.string()).optional(),
	thumbnail: Joi.string().required(),
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
				_id: Joi.string().allow(null),
				activity: Joi.string(),
				description: Joi.string(),
				address: Joi.string(),
				duration: Joi.number().greater(0),
				timeline: Joi.string().optional().allow(""),
				location: Joi.object({
					type: Joi.string().optional(),
					coordinates: Joi.array().items(Joi.number()).optional(),
				}).optional(),
				image: Joi.string().optional().allow(""),
			}),
		)
		.optional(),
	regularPrice: Joi.number().greater(0).required().messages({
		"number.base": "Regular Price must be of type number",
		"number.greater": "Invalid regular price",
		"number.required": "Regular price is a required field",
	}),
	discountPrice: Joi.number().optional().allow(null).default(0),
	discountPercentage: Joi.number().optional().allow(null).default(0),
	duration: Joi.number().greater(0).required(),
	numOfRating: Joi.number().greater(0).optional().allow(null),
	ratingAverage: Joi.number().greater(0).optional().allow(null),
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
	location: Joi.string().optional(),
	transports: Joi.array().items(Joi.string()).optional(),
	hotels: Joi.array().items(Joi.string()).optional(),
	virtualTours: Joi.array().items(
		Joi.object({
			_id: Joi.string().allow(null),
			id: Joi.string().allow(null),
			name: Joi.string().allow(null).optional(),
			images: Joi.array().items(Joi.string()),
			hotspots: Joi.array().items(
				Joi.object({
					_id: Joi.string().allow(null),
					id: Joi.string(),
					pitch: Joi.number().optional().allow(null),
					yaw: Joi.number().optional().allow(null),
					name: Joi.string().optional().allow(null).allow(""),
					action: Joi.string().optional().allow(null).allow(""),
				})
			).optional().allow(null),
			processedImage: Joi.string().optional().allow(null),
		}).optional().allow(null),
	).optional(),
	isPrivate: Joi.boolean().optional().default(false),
	defaultVacancies: Joi.number().min(0).optional().default(20),
	vacancies: Joi.object().optional(),
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
	type: Joi.string().optional(),
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
				_id: Joi.string().allow(null),
				activity: Joi.string(),
				description: Joi.string(),
				address: Joi.string(),
				duration: Joi.number().greater(0),
				timeline: Joi.string().optional().allow(""),
				location: Joi.object({
					type: Joi.string().optional(),
					coordinates: Joi.array().items(Joi.number()).optional(),
				}).optional(),
				image: Joi.string().optional().allow(""),
			}),
		)
		.optional(),
	regularPrice: Joi.number().greater(0).optional(),
	discountPrice: Joi.number().optional().allow(null).default(0),
	discountPercentage: Joi.number().optional().allow(null).default(0),
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
	location: Joi.string().optional(),
	transports: Joi.array().items(Joi.string()).optional(),
	hotels: Joi.array().items(Joi.string()).optional(),
	virtualTours: Joi.array().items(
		Joi.object({
			_id: Joi.string().allow(null),
			id: Joi.string().allow(null),
			name: Joi.string().allow(null).optional(),
			images: Joi.array().items(Joi.string()),
			hotspots: Joi.array().items(
				Joi.object({
					_id: Joi.string().allow(null),
					id: Joi.string(),
					pitch: Joi.number().optional().allow(null),
					yaw: Joi.number().optional().allow(null),
					name: Joi.string().optional().allow(null).allow(""),
					action: Joi.string().optional().allow(null).allow(""),
				})
			).optional().allow(null),
			processedImage: Joi.string().optional().allow(null),
		}).optional().allow(null),
	).optional(),
	isPrivate: Joi.boolean().optional().default(false),
	defaultVacancies: Joi.number().min(0).optional().default(20),
	vacancies: Joi.object().optional(),
});

module.exports = {
	tourSchema,
	updateTourSchema,
};
