const BookingModel = require("../models/booking.model");
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
}

module.exports = StatisticService;
