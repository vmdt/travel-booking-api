const { getRevenueSchema } = require("../schemes/statistic");
const StatisticService = require("../services/statistic.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response");

class StatisticController {
	getRevenue = async (req, res, next) => {
		const { startDate, endDate, period } = req.query;
		const { error } = await Promise.resolve(
			getRevenueSchema.validate(req.query),
		);
		if (error?.details) throw new BadRequestError(error.details[0].message);

		let start = new Date(startDate);
		let end = new Date(endDate);

		const starts = startDate.split("-");
		const ends = endDate.split("-");
		start.setMonth(starts[1] ? parseInt(starts[1]) - 1 : 0);
		start.setDate(starts[2] ? parseInt(starts[2]) : 1);
		end.setMonth(ends[1] ? parseInt(ends[1]) - 1 : 11);
		end.setDate(ends[2] ? parseInt(ends[2]) : 31);

		const revenues = await StatisticService.getRevenues({
			startDate: start,
			endDate: end,
			period,
		});

		new SuccessResponse({
			message: "Get revenues successfully",
			metadata: revenues,
		}).send(res);
	};

	getTotalRevenue = async (req, res, next) => {
		new SuccessResponse({
			message: "Get total revenue successfully",
			metadata: await StatisticService.getTotalRevenue(),
		}).send(res);
	};

	getTopBookedTours = async (req, res, next) => {
		const { numOfTours } = req.query;
		new SuccessResponse({
			message: "Get top booked tours successfully",
			metadata: await StatisticService.getTopBookedTours(numOfTours),
		}).send(res);
	};

	getRevenueByMonth = async (req, res, next) => {
		const { month } = req.query;
		new SuccessResponse({
			message: "Get revenue by month successfully",
			metadata: await StatisticService.getRevenueByMonth(month),
		}).send(res);
	}

	getTotalUsers = async (req, res, next) => {
		new SuccessResponse({
			message: "Get total users successfully",
			metadata: await StatisticService.getTotalUsers(),
		}).send(res);
	}
}

module.exports = new StatisticController();
