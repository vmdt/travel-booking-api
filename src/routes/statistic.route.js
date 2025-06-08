const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const statisticController = require("../controllers/statistic.controller");
const asyncHandler = require("../helpers/async.handler");

class StatisticRoute {
	constructor() {
		this.router = express.Router();
	}

	routes() {
		this.router.use([protect, restrictTo("admin")]);
		this.router.get("/revenue", asyncHandler(statisticController.getRevenue));
		this.router.get(
			"/total-revenue",
			asyncHandler(statisticController.getTotalRevenue),
		);
		this.router.get(
			"/top-booked-tours",
			asyncHandler(statisticController.getTopBookedTours),
		);
		this.router.get(
			"/revenue-by-month",
			asyncHandler(statisticController.getRevenueByMonth),
		);
		this.router.get(
			"/total-users",
			asyncHandler(statisticController.getTotalUsers),
		);

		return this.router;
	}
}

module.exports = new StatisticRoute();
