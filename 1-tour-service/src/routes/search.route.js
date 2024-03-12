const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const searchController = require('../controllers/search.controller');
const asyncHandler = require('../helpers/async.handler');

class SearchRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.get('/:keyword', asyncHandler(searchController.search));
        return this.router;
    }
}

module.exports = new SearchRoutes();