const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const locationController = require('../controllers/location.controller');
const asyncHandler = require('../helpers/async.handler');

class LocationRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.get('/search/:keyword', asyncHandler(locationController.searchLocation));
        this.router.route('/:locId')
                    .get(asyncHandler(locationController.getLocationById))
                    .post(protect, restrictTo('admin'), asyncHandler(locationController.updateLocation))
                    .delete(protect, restrictTo('admin'), asyncHandler(locationController.deleteLocation));

        this.router.route('/')
                    .get(asyncHandler(locationController.getAllLocations))
                    .post(protect, restrictTo('admin'), asyncHandler(locationController.createLocation))

        return this.router;
    }
}

module.exports = new LocationRoutes();