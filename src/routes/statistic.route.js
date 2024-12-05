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

		return this.router;
	}
}

module.exports = new StatisticRoute();
