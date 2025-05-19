const { Types } = require("mongoose");
const TourModel = require("../models/tour.model");

const { NotFoundError } = require("../utils/error.response");

class ExportService {
	static exportItinerary = async (tourId) => {
		let tour = await TourModel.findById(new Types.ObjectId(tourId)).lean();
		if (!tour) {
			throw new NotFoundError("Not found tour");
		}

		const formData = new URLSearchParams();
		formData.append("tour", JSON.stringify(tour));

		return formData;
	};
}

module.exports = ExportService;
