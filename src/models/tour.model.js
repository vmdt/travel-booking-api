const mongoose = require("mongoose");

const Tour = new mongoose.Schema({
	code: { type: String, required: true },
	title: { type: String, required: true },
	type: { type: String, default: "activity" },
	summary: String,
	highlights: [{ type: String }],
	description: String,
	thumbnail: {
		type: String,
		required: true,
	},
	images: [{ type: String }],
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
	},
	interest: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Interest",
	},
	startLocation: {
		type: {
			type: String,
			enum: ["Point"],
			default: "Point",
		},
		coordinates: [Number],
		description: String,
		address: String,
	},
	details: [
		{
			title: String,
			description: String,
		},
	],
	inclusions: [String],
	exclusions: [String],
	itinerary: [
		{
			activity: String,
			description: String,
			address: String,
			duration: Number,
			location: {
				type: {
					type: String,
					enum: ["Point"],
					default: "Point",
				},
				coordinates: [Number],
			},
			icon: String,
		},
	],
	regularPrice: { type: Number, required: true },
	discountPrice: Number,
	currency: { type: String, default: "VND" },
	discountPercentage: { type: Number, default: 0 },
	duration: Number,
	numOfRating: { type: Number, default: 0 },
	ratingAverage: Number,
	isActive: { type: Boolean, default: true },
	locations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Location",
		},
	],
	transports: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Transportation",
		},
	],
	hotels: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Hotel",
		},
	],
	priceOptions: [
		{
			title: {
				type: String,
				enum: ["Adult", "Youth", "Children", "Infant"],
			},
			participantsCategoryIdentifier: String,
			value: Number,
			currency: { type: String, default: "VND" },
		},
	],
});

Tour.index({ startLocation: "2dsphere" });
Tour.index({ title: "text" });

module.exports = mongoose.model("Tour", Tour);
