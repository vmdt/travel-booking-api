const axios = require("axios");
const ExportService = require("../services/export.service");
const config = require("../config");

class ExportController {
	exportItinerary = async (req, res, next) => {
		const { tourId } = req.params;
		const formData = await ExportService.exportItinerary(tourId);

		const response = await axios.post(
			`${config.PYTHON_EXPORT_URL}/pdf/itinerary`,
			formData,
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", "attachment; filename=itinerary.pdf");
		res.send(response.data);
	};
}

module.exports = new ExportController();
