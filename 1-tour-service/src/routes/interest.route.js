const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const asyncHandler = require('../helpers/async.handler');
const interestController = require('../controllers/interest.controller');

class InterestRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.get('/:interestId', asyncHandler(interestController.getInterestById));
        this.router.route('/')
                    .post(asyncHandler(interestController.createInterest))
                    .get(asyncHandler(interestController.getAllInterests))
        return this.router;
    }
}

module.exports = new InterestRoutes();