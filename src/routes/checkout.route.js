const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const checkoutController = require('../controllers/checkout.controller');
const asyncHandler = require('../helpers/async.handler');

class CheckoutRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.use(protect);
        this.router.get('/re-pay/:bookingId/:paymentMethod', asyncHandler(checkoutController.payBooking));
        this.router.post('/review', asyncHandler(checkoutController.checkoutReview));
        return this.router;
    }
}

module.exports = new CheckoutRoutes();