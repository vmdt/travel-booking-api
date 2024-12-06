const { Types } = require("mongoose");
const BookingModel = require("../models/booking.model");
const BookingItemsModel = require("../models/bookingItems.model");
const { formatRevenue } = require("../utils");

class StatisticService {
	static getRevenues = async ({ startDate, endDate, period = "month" }) => {
		const groupFormat = period === "month" ? "%Y-%m" : "%Y-%m-%d";
		try {
			const revenues = await BookingModel.aggregate([
				{
					$match: {
						status: "completed",
						approveAt: {
							$gte: startDate,
							$lte: endDate,
						},
					},
				},
				{
					$group: {
						_id: {
							$dateToString: { format: groupFormat, date: "$approveAt" },
						},
						revenue: { $sum: "$checkoutOrder.totalPrice" },
					},
				},
				{
					$project: {
						date: "$_id",
						revenue: 1,
					},
				},
			]);

			return formatRevenue(revenues, startDate, endDate, period);
		} catch (error) {
			return null;
		}
	};

	static getTotalRevenue = async () => {
		const revenue = await BookingModel.aggregate([
			{
				$match: {
					status: "completed",
				},
			},
			{
				$group: {
					_id: null,
					total: { $sum: "$checkoutOrder.totalPrice" },
				},
			},
		]);

		return {
			total: revenue.length ? revenue[0].total : 0,
		};
	};

	static getTopBookedTours = async (numOfTours) => {
		const topBookedTours = await BookingItemsModel.aggregate([
			{
				$unwind: "$participants",
			},
			{
				$group: {
					_id: "$tour._id",
					total: { $sum: "$participants.quantity" },
				},
			},
			{
				$sort: { total: -1 },
			},
			{
				$limit: parseInt(numOfTours),
			},
			{
				$lookup: {
					from: "tours",
					localField: "_id",
					foreignField: "_id",
					as: "tour",
				},
			},
			{
				$unwind: "$tour",
			},
			{
				$project: {
					"tour._id": 1,
					"tour.title": 1,
					"tour.code": 1,
					"tour.thumbnail": 1,
					"tour.numOfRating": 1,
					"tour.ratingAverage": 1,
					"tour.regularPrice": 1,
					"tour.currency": 1,
					total: 1,
				},
			},
		]);

		return topBookedTours;
	};
}

module.exports = StatisticService;
