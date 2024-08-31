const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const bookingController = require('../controllers/booking.controller');
const asyncHandler = require('../helpers/async.handler');

class BookingRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.use(protect);
        this.router.post('/book-now', asyncHandler(bookingController.bookNow));
        this.router.get('/list', asyncHandler(bookingController.getListBookingsByUser));

        this.router.route('/:bookingId')
            .get(asyncHandler(bookingController.getBookingDetails))
            .delete(asyncHandler(bookingController.deleteBooking));

        this.router.route('/')
            .post(asyncHandler(bookingController.createBooking))
            .get(asyncHandler(bookingController.getListBookings));
        return this.router;
    }
}

module.exports = new BookingRoutes();