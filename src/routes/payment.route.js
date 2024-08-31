const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');
const asyncHandler = require('../helpers/async.handler');

class PaymentRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.get('/vnpay/callback', asyncHandler(paymentController.getVnpayResult));
        return this.router;
    }
}

module.exports = new PaymentRoutes();