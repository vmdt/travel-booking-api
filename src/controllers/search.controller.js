const SearchService = require("../services/search.service");
const { SuccessResponse } = require("../utils/sucess.response");

class SearchController {
	search = async (req, res, next) => {
		new SuccessResponse({
			message: "Searching was success",
			metadata: await SearchService.search(req.params.keyword, req.query.limit),
		}).send(res);
	};

	searchTours = async (req, res, next) => {
		new SuccessResponse({
			message: "Searching tours was success",
			metadata: await SearchService.searchTours(
				req.params.keyword,
				req.query.limit,
			),
		}).send(res);
	};
}

module.exports = new SearchController();
