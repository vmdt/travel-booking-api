const express = require("express");
const exportController = require("../controllers/export.controller");
const asyncHandler = require("../helpers/async.handler");

class ExportRoute {
	constructor() {
		this.router = express.Router();
	}

	routes() {
		this.router.get(
			"/itinerary",
			asyncHandler(exportController.exportItinerary),
		);

		return this.router;
	}
}

module.exports = new ExportRoute();
