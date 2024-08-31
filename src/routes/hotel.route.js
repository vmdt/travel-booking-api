const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const hotelController = require('../controllers/hotel.controller');
const asyncHandler = require('../helpers/async.handler');

class HotelRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.get('/search/:keyword', asyncHandler(hotelController.searchHotel));
        this.router.route('/:hotelId')
                .post(protect, restrictTo('admin'), asyncHandler(hotelController.updateHotel))
                .delete(protect, restrictTo('admin'), asyncHandler(hotelController.deleteHotel))

        this.router.route('/')
                    .get(asyncHandler(hotelController.getAllHotels))
                    .post(protect, restrictTo('admin'), asyncHandler(hotelController.createHotel))
        return this.router;
    }
}

module.exports = new HotelRoutes();