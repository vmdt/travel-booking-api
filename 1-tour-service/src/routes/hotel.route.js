const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const hotelController = require('../controllers/hotel.controller');
const asyncHandler = require('../helpers/async.handler');

class HotelRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.route('/')
                    .get(asyncHandler(hotelController.getAllHotels))
                    .post(protect, restrictTo('admin'), asyncHandler(hotelController.createHotel))
        return this.router;
    }
}

module.exports = new HotelRoutes();