const SearchService = require("../services/search.service");
const { SuccessResponse } = require("../utils/sucess.response");

class SearchController {
    search = async (req, res, next) => {
        new SuccessResponse({
            message: 'Searching was success',
            metadata: await SearchService.search(req.params.keyword)
        }).send(res);
    }
}

module.exports = new SearchController();