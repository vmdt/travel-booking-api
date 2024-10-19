const _ = require("lodash");
const { Types } = require("mongoose");
const TourModel = require("../models/tour.model");
const {
	getMany,
	updateOne,
	deleteOne,
	getOne,
} = require("../repositories/factory.repo");
const {
	createTour,
	getAllTours,
	updateTourById,
} = require("../repositories/tour.repo");
const { NotFoundError, BadRequestError } = require("../utils/error.response");
const { isDataURL } = require("../utils");
const { upload } = require("../helpers/cloudinary");

class TourService {
	static getTourDetail = async (tourId) => {
		const tour = await getOne(
			TourModel,
			{
				_id: new Types.ObjectId(tourId),
			},
			true,
			"category locations transports hotels",
		);
		return tour;
	};

	static getToursWithin = async ({ distance, latlng, unit }) => {
		const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
		const [lat, lng] = latlng.split(",");
		if (!lat || !lng)
			throw new BadRequestError(
				"Please provide latitude and longtitude in the format lat,lng",
			);

		const tours = await TourModel.find({
			startLocation: {
				$geoWithin: {
					$centerSphere: [[lng * 1, lat * 1], radius],
				},
			},
		});

		return {
			result: tours.length,
			tours,
		};
	};

	static getDistances = async ({ latlng, maxDistance, unit }) => {
		const multiplier = unit === "km" ? 1000 : 1609.3;
		const [lat, lng] = latlng.split(",");
		if (!lat || !lng)
			throw new BadRequestError(
				"Please provide latitude and longtitude in the format lat,lng",
			);

		const distances = await TourModel.aggregate([
			{
				$geoNear: {
					near: { type: "Point", coordinates: [lng * 1, lat * 1] },
					spherical: true,
					maxDistance: maxDistance * multiplier,
					distanceField: "distance",
					distanceMultiplier: 1 / multiplier,
				},
			},
			{
				$project: {
					distance: 1,
					title: 1,
					thumbnail: 1,
				},
			},
		]);

		return {
			result: distances.length,
			distances,
		};
	};

	static createTour = async (payload) => {
		const { thumbnail, images, code } = payload;
		if (isDataURL(thumbnail)) {
			const thumbResult = await upload(thumbnail, {
				folder: "travelife/tour",
				overwrite: true,
				invalidate: true,
				public_id: `${code}`,
			});
			if (!thumbResult?.public_id)
				throw new BadRequestError("File upload error");
			payload.thumbnail = thumbResult?.secure_url;
		}

		payload.images = await Promise.all(
			images.map(async (img, i) => {
				if (isDataURL(img)) {
					const imgResult = await upload(img, {
						folder: "travelife/tour",
						overwrite: true,
						invalidate: true,
						public_id: `${code}-${i}`,
					});
					if (!imgResult?.public_id)
						throw new BadRequestError("File upload error");
					return imgResult?.secure_url;
				}
				return img;
			}),
		);

		const newTour = await createTour(payload, "category", "interest");
		return {
			tour: newTour.toObject(),
		};
	};

	static getAllTours = async (query) => {
		const { total, docs } = await getAllTours(query, "category", "interest");
		return {
			total,
			result: docs.length,
			tours: docs,
		};
	};

	static getInactiveTours = async (query) => {
		const tours = await getMany(
			TourModel,
			{
				isActive: false,
			},
			query,
			["category", "interest"],
		);
		return {
			result: tours.length,
			tours,
		};
	};

	static getActiveTours = async (query) => {
		const tours = await getMany(
			TourModel,
			{
				isActive: true,
			},
			query,
			["category", "interest"],
		);
		return {
			result: tours.length,
			tours,
		};
	};

	static activateTour = async (tourId) => {
		const tour = await updateOne(
			TourModel,
			{
				_id: new Types.ObjectId(tourId),
			},
			{ isActive: true },
		);
		if (!tour) throw new NotFoundError("Not found tour");
		return {
			tour: tour.toObject(),
		};
	};

	static deactivateTour = async (tourId) => {
		const tour = await updateOne(
			TourModel,
			{
				_id: new Types.ObjectId(tourId),
			},
			{ isActive: false },
		);
		if (!tour) throw new NotFoundError("Not found tour");
		return {
			tour: _.pick(tour.toObject(), ["_id", "isActive"]),
		};
	};

	static updateTour = async (tourId, payload) => {
		const tourExisting = await TourModel.findById(
			new Types.ObjectId(tourId),
		).lean();
		if (!tourExisting) throw new NotFoundError("Not found tour");
		if (!tourExisting.isActive)
			throw new BadRequestError("Tour has been deactivated");
		const { thumbnail, images } = payload;
		if (thumbnail) {
			if (isDataURL(thumbnail)) {
				const thumbResult = await upload(thumbnail, {
					folder: "travelife/tour",
					overwrite: true,
					invalidate: true,
					public_id: `${tourExisting.code}`,
				});
				if (!thumbResult?.public_id)
					throw new BadRequestError("File upload error");
				payload.thumbnail = thumbResult?.secure_url;
			}
		}
		if (images) {
			payload.images = await Promise.all(
				images.map(async (img, i) => {
					if (isDataURL(img)) {
						const imgResult = await upload(img, {
							folder: "travelife/tour",
							overwrite: true,
							invalidate: true,
							public_id: `${tourExisting.code}-${i}`,
						});
						if (!imgResult?.public_id)
							throw new BadRequestError("File upload error");
						return imgResult?.secure_url;
					}
					return img;
				}),
			);
		}
		const tour = await updateTourById(tourId, payload);

		return {
			tour: tour.toObject(),
		};
	};

	static deleteTour = async (tourId) => {
		const tour = await deleteOne(TourModel, tourId);
		if (!tour) throw new NotFoundError("Not found tour");
		return null;
	};

	static getToursByCategory = async (categoryId, query) => {
		const { total, docs: tours } = await getMany(
			TourModel,
			{ category: categoryId },
			query,
		);
		return {
			total,
			result: tours.length,
			tours,
		};
	};

	static getTopDiscountTours = async (query) => {
		const { total, docs: tours } = await getMany(
			TourModel,
			{
				$or: [
					{ discountPrice: { $gt: 0 } },
					{ discountPercentage: { $gt: 0 } },
				],
			},
			{
				...query,
				limit: query.limit || 10,
				sort: "-discountPrice -discountPercentage",
			},
		);

		return {
			total,
			result: tours.length,
			tours,
		};
	};
}

module.exports = TourService;
