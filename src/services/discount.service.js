const _ = require("lodash");
const { Types } = require("mongoose");
const DiscountModel = require("../models/discount.model");
const TourModel = require("../models/tour.model");
const moment = require('moment-timezone');
const {
	getOne,
	createOne,
	getAll,
	getMany,
	updateOne,
} = require("../repositories/factory.repo");
const { BadRequestError, NotFoundError } = require("../utils/error.response");
const { publishDirectMessage } = require("../queues/auth.producer");
const UserModel = require("../models/user.model");
const config = require("../config");

class DiscountService {
	static createDiscount = async (payload) => {
		const {
			name,
			code,
			value,
			type,
			startDate,
			endDate,
			minOrder,
			isActive,
			tours,
			appliesTo,
			scheduleAt,
		} = payload;
		const discountExisting = await DiscountModel.findOne({ code }).lean();

		if (discountExisting) throw new BadRequestError("Discount already exists");

		const discount = await createOne(DiscountModel, {
			name,
			code,
			value,
			type,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			minOrder,
			isActive,
			appliesTo,
			scheduleAt: scheduleAt ? moment.tz(scheduleAt, 'Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss') : null,
			tours: appliesTo === "total_order" ? [] : tours,
			applyUsers: payload.applyUsers || [],
			usedUsers: payload.usedUsers || [],
		});

		if (discount.scheduleAt) {
			const formatted = moment.utc(discount.scheduleAt).tz('Asia/Ho_Chi_Minh').format("YYYY-MM-DD HH:mm:ss");
			const startDate = moment(discount.startDate).format("YYYY-MM-DD");
			const endDate = moment(discount.endDate).format("YYYY-MM-DD");
			const channel = await require("../server").channel;
			const discountUsers = await getOne(
				DiscountModel,
				{ _id: discount._id },
				true,
				[
					{ path: "applyUsers", select: "email" },
					{ path: "tours", select: "title" },
				]
			);
			let tourName = "";
			let tourLink = "";
			if (discount.appliesTo === "specific" && discountUsers.tours.length > 0) {
				tourName = discountUsers.tours[0].title;
				tourLink = `${config.CLIENT_URL}/tour-detail/${discountUsers.tours[0]._id}`;
			}

			const emails = discountUsers.applyUsers.map((user) => user.email);

			await publishDirectMessage(
				channel,
				"microservice",
				"microservice_key",
				JSON.stringify({
					discount_id: discount._id,
					template: "discount",
					emails: emails,
					schedule_at: formatted,
					metadata: {
						appIcon: "https://res.cloudinary.com/dxrygyw5d/image/upload/v1709968499/travelife-logo_uf55mo.png",
						appLink: `${config.CLIENT_URL}`,
						discountName: discount.name,
						discountCode: discount.code,
						tourName: tourName,
						tourLink: tourLink,
						value: discount.value.toString(),
						type: discount.type,
						startDate,
						endDate,
					}
				})
			);
		}

		return { discount };
	};

	static searchDiscount = async (code) => {
		const foundDiscounts = await DiscountModel.find({
			isActive: true,
			code: { $regex: `^${code}`, $options: "iu" },
		}).lean();

		return {
			result: foundDiscounts.length,
			discounts: foundDiscounts,
		};
	};

	static getAllDiscounts = async (query) => {
		const { total, docs: discounts } = await getAll(DiscountModel, query);
		return {
			total,
			result: discounts.length,
			discounts,
		};
	};

	static getActiveDiscounts = async (query) => {
		const { total, docs: discounts } = await getMany(
			DiscountModel,
			{
				isActive: true,
			},
			query,
		);

		return {
			total,
			result: discounts.length,
			discounts,
		};
	};

	static getInactiveDiscounts = async (query) => {
		const { total, docs: discounts } = await getMany(
			DiscountModel,
			{
				isActive: true,
			},
			query,
		);

		return {
			total,
			result: discounts.length,
			discounts,
		};
	};

	static activateDiscount = async (discountId) => {
		const discount = await updateOne(
			DiscountModel,
			{
				_id: new Types.ObjectId(discountId),
			},
			{ isActive: true },
		);
		if (!discount) throw new NotFoundError("Not found discount");
		return {
			discount: discount.toObject(),
		};
	};

	static deactivateDiscount = async (discountId) => {
		const discount = await updateOne(
			DiscountModel,
			{
				_id: new Types.ObjectId(discountId),
			},
			{ isActive: false },
		);
		if (!discount) throw new NotFoundError("Not found discount");
		return {
			discount: discount.toObject(),
		};
	};

	static getDiscountById = async (discountId) => {
		const discount = await getOne(DiscountModel, {
			_id: new Types.ObjectId(discountId),
		});
		if (!discount) throw new NotFoundError("Not found discount");
		if (!discount.isActive)
			throw new BadRequestError("Discount has been deactivated");

		return discount;
	};

	static updateDiscount = async (discountId, payload) => {
		const discountExisting = await DiscountModel.findById(
			new Types.ObjectId(discountId),
		).lean();
		if (!discountExisting) throw new NotFoundError("Not found discount");
		if (!discountExisting.isActive)
			throw new BadRequestError("Discount has been deactivated");

		const discount = await updateOne(
			DiscountModel,
			{
				_id: new Types.ObjectId(discountId),
			},
			payload,
		);

		if (discountExisting.taskQueueId && discountExisting.scheduleAt && discountExisting.scheduleAt !== discount.scheduleAt) {
			const formatted = moment.utc(discount.scheduleAt).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
			const startDate = moment(discount.startDate).format("YYYY-MM-DD");
			const endDate = moment(discount.endDate).format("YYYY-MM-DD");
			const channel = await require("../server").channel;

			const discountUsers = await getOne(
				DiscountModel,
				{ _id: discount._id },
				true,
				[
					{ path: "applyUsers", select: "email" },
					{ path: "tours", select: "title" },
				]
			);

			let tourName = "";
			let tourLink = "";
			const emails = discountUsers.applyUsers.map((user) => user.email);
			if (discount.appliesTo === "specific" && discountUsers.tours.length > 0) {
				tourName = discountUsers.tours[0].title;
				tourLink = `${config.CLIENT_URL}/tour-detail/${discountUsers.tours[0]._id}`;
			}

			await publishDirectMessage(
				channel,
				"microservice",
				"microservice_key",
				JSON.stringify({
					discount_id: discountExisting._id,
					template: "discount",
					schedule_at: formatted,
					emails: emails,
					task_queue_id: discountExisting.taskQueueId,
					metadata: {
						appIcon: "https://res.cloudinary.com/dxrygyw5d/image/upload/v1709968499/travelife-logo_uf55mo.png",
						appLink: `${config.CLIENT_URL}`,
						tourName: tourName,
						tourLink: tourLink,
						discountName: discount.name,
						discountCode: discount.code,
						value: discount.value.toString(),
						type: discount.type,
						startDate,
						endDate,
						scheduleAt: formatted,
					}
				})
			)
		}

		return {
			discount: discount.toObject(),
		};
	};

	static getToursByDiscountCode = async (code, query) => {
		const discount = await DiscountModel.findOne({ code }).lean();
		if (!discount) throw new NotFoundError("Not found discount");
		if (!discount.isActive)
			throw new BadRequestError("Discount has been deactivated");

		const { total, docs: tours } = await getMany(
			TourModel,
			{
				_id: { $in: discount.tours },
			},
			query,
			true,
		);

		return {
			total,
			result: tours.length,
			tours,
		};
	};

	static getDiscountAmount = async ({ code, tours }) => {
		const discountExisting = await DiscountModel.findOne({ code }).lean();
		if (!discountExisting) throw new NotFoundError("Not found discount");

		const {
			isActive,
			startDate,
			endDate,
			maxUses,
			usedCount,
			minOrder,
			type,
			value,
			appliesTo,
		} = discountExisting;

		if (!isActive) throw new BadRequestError("Discount has been deactivated");

		const currentDate = new Date().setHours(0, 0, 0, 0);
		if (endDate < currentDate || currentDate < startDate)
			throw new BadRequestError("Invalid discount");

		if (usedCount >= maxUses) throw new BadRequestError("Discount ran out");

		const totalOrder = tours.reduce((acc, tour) => {
			return acc + tour.totalPrice;
		}, 0);

		if (totalOrder < minOrder)
			throw new BadRequestError(`Discount require min order of ${minOrder}`);
		let amount = 0,
			discountTours = [],
			discountPrice;
		if (appliesTo === "specific") {
			tours.forEach((tour) => {
				const match = discountExisting.tours.some((el) => {
					return el.toString() === tour.tourId.toString();
				});
				if (match) {
					discountPrice =
						type === "fixed_amount" ? value : tour.totalPrice * (value / 100);
					amount += discountPrice;
					tour.discountPrice = discountPrice;
					discountTours.push({ tour });
				}
			});
		} else {
			tours.forEach((tour) => {
				discountPrice =
					type === "fixed_amount" ? value : tour.totalPrice * (value / 100);
				amount += discountPrice;
				tour.discountPrice = discountPrice;
				discountTours.push({ tour });
			});
		}

		return {
			itemPrices: discountTours,
			checkoutOrder: {
				totalOrder,
				discount: amount,
				totalPrice: totalOrder - amount,
			},
		};
	};
}

module.exports = DiscountService;
