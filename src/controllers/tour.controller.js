const { tourSchema, updateTourSchema } = require("../schemes/tour/tour");
const TourService = require("../services/tour.service");
const UploadService = require("../services/upload.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse, NoContent } = require("../utils/sucess.response");

class TourController {
	getTourDetail = async (req, res, next) => {
		new SuccessResponse({
			message: "Get tour detail successfully",
			metadata: await TourService.getTourDetail(req.params.tourId),
		}).send(res);
	};

	getToursWithin = async (req, res, next) => {
		new SuccessResponse({
			message: "Get tours within distance successfully",
			metadata: await TourService.getToursWithin(req.params),
		}).send(res);
	};

	getDistances = async (req, res, next) => {
		new SuccessResponse({
			message: "Get distances successfully",
			metadata: await TourService.getDistances(req.params),
		}).send(res);
	};

	createTour = async (req, res, next) => {
		const { error } = await Promise.resolve(tourSchema.validate(req.body));
		if (error?.details) throw new BadRequestError(error.details[0].message);

		new SuccessResponse({
			message: "Create Tour Successfully",
			metadata: await TourService.createTour(req.body),
		}).send(res);
	};

	getAllTours = async (req, res, next) => {
		new SuccessResponse({
			message: "Get all tours successfully",
			metadata: await TourService.getAllTours(req.query),
		}).send(res);
	};

	getInactiveTours = async (req, res, next) => {
		new SuccessResponse({
			message: "Get inactive tours successfully",
			metadata: await TourService.getInactiveTours(req.query),
		}).send(res);
	};

	getActiveTours = async (req, res, next) => {
		new SuccessResponse({
			message: "Get active tours successfully",
			metadata: await TourService.getActiveTours(req.query),
		}).send(res);
	};

	activateTour = async (req, res, next) => {
		new SuccessResponse({
			message: "Activated tour successfully",
			metadata: await TourService.activateTour(req.params.tourId),
		}).send(res);
	};

	deactivateTour = async (req, res, next) => {
		new SuccessResponse({
			message: "Deactivated tour successfully",
			metadata: await TourService.deactivateTour(req.params.tourId),
		}).send(res);
	};

	updateTour = async (req, res, next) => {
		const { error } = await Promise.resolve(
			updateTourSchema.validate(req.body),
		);
		if (error?.details) throw new BadRequestError(error.details[0].message);
		new SuccessResponse({
			message: "Update tour successfully",
			metadata: await TourService.updateTour(req.params.tourId, req.body),
		}).send(res);
	};

	deleteTour = async (req, res, next) => {
		new NoContent({
			message: "Delete tour successfully",
			metadata: await TourService.deleteTour(req.params.tourId),
		}).send(res);
	};

	getToursByCategory = async (req, res, next) => {
		new SuccessResponse({
			message: "Get tours by category successfully",
			metadata: await TourService.getToursByCategory(
				req.params.categoryId,
				req.query,
			),
		}).send(res);
	};

	getTopDiscountTours = async (req, res, next) => {
		new SuccessResponse({
			messgae: "Get top discount tours successfully",
			metadata: await TourService.getTopDiscountTours(req.query),
		}).send(res);
	};
}

module.exports = new TourController();
