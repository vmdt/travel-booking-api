const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const asyncHandler = require("../helpers/async.handler");
const tourController = require("../controllers/tour.controller");

class TourRoutes {
	constructor() {
		this.router = express.Router();
	}

	routes() {
		this.router.get(
			"/tours-within/:distance/center/:latlng/unit/:unit",
			asyncHandler(tourController.getToursWithin),
		);
		this.router.get(
			"/distances/:latlng/max/:maxDistance/unit/:unit",
			asyncHandler(tourController.getDistances),
		);

		this.router.get(
			"/top-discount-tours",
			asyncHandler(tourController.getTopDiscountTours),
		);

		this.router.get("/all", asyncHandler(tourController.getAllTours));
		this.router.get(
			"/active-tours/all",
			asyncHandler(tourController.getActiveTours),
		);
		this.router.get(
			"/inactive-tours/all",
			asyncHandler(tourController.getInactiveTours),
		);
		this.router.get("/:tourId", asyncHandler(tourController.getTourDetail));
		this.router.get(
			"/category/:categoryId",
			asyncHandler(tourController.getToursByCategory),
		);

		this.router.use([protect, restrictTo("admin")]);
		this.router.post(
			"/activate/:tourId",
			asyncHandler(tourController.activateTour),
		);
		this.router.post(
			"/deactivate/:tourId",
			asyncHandler(tourController.deactivateTour),
		);
		this.router
			.route("/:tourId")
			.post(asyncHandler(tourController.updateTour))
			.delete(asyncHandler(tourController.deleteTour));
		this.router.route("/").post(asyncHandler(tourController.createTour));
		return this.router;
	}
}

module.exports = new TourRoutes();
