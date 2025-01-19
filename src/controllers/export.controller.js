const axios = require("axios");

class ExportController {
	exportItinerary = async (req, res, next) => {
		const tour = {
			title: "From Paris with Love",
			ratingAverage: 4.8,
			itinerary: [
				{
					activity: "Visit Eiffel Tower",
					description:
						"The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France.",
					timeline: "8:00 - 9:00",
				},
				{
					activity: "Visit Louvre Museum",
					description:
						"The Louvre, or the Louvre Museum, is the world's largest art museum and a historic monument in Paris, France.",
					timeline: "9:30 - 11:30",
				},
				{
					activity: "Visit Notre-Dame Cathedral",
					description:
						"Notre-Dame de Paris, referred to simply as Notre-Dame, is a medieval Catholic cathedral on the Île de la Cité in the 4th arrondissement of Paris.",
					timeline: "12:00 - 13:00",
				},
			],
		};

		const formData = new URLSearchParams();
		formData.append("tour", JSON.stringify(tour));

		const response = await axios.post(
			"http://python-export:5000/pdf/itinerary",
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
