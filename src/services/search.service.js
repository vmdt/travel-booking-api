const LocationModel = require("../models/location.model");
const TourModel = require("../models/tour.model");

class SearchService {
	static search = async (keyword, limit) => {
		let suggestions = [];
		suggestions = await LocationModel.find({
			title: { $regex: `^${keyword}`, $options: "iu" },
		}).lean();

		if (suggestions.length <= 1) {
			const regexSearch = new RegExp(`^${keyword}`, "iu");
			const foundTours = await TourModel.find(
				{
					isActive: true,
					$text: { $search: regexSearch },
				},
				{ score: { $meta: "textScore" } },
			)
				.sort({ score: { $meta: "textScore" } })
				.select("title thumbnail type startLocation")
				.lean();

			suggestions.push(...foundTours);
		}

		if (limit && limit * 1 < suggestions.length) {
			suggestions = suggestions.slice(0, limit * 1);
		}

		return {
			result: suggestions.length,
			suggestions,
		};
	};

	static searchTours = async (keyword, limit = 100) => {
		let suggestions = [];
		suggestions = await TourModel.find({
			isActive: true,
			title: { $regex: `\\b${keyword}`, $options: "iu" },
		})
			.limit(limit * 1)
			.select("title thumbnail type startLocation summary")
			.lean();

		return {
			result: suggestions.length,
			suggestions,
		};
	};
}

module.exports = SearchService;
