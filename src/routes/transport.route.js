const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const transportController = require('../controllers/transport.controller');
const asyncHandler = require('../helpers/async.handler');

class TransportRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.get('/search/:keyword', asyncHandler(transportController.searchTransport));

        this.router.route('/:transId')
                    .get(asyncHandler(transportController.getTransportById))
                    .post(protect, restrictTo('admin'), asyncHandler(transportController.updateTransport))
                    .delete(protect, restrictTo('admin'), asyncHandler(transportController.deleteTransport))

        this.router.route('/')
                    .get(asyncHandler(transportController.getAllTransports))
                    .post(protect, restrictTo('admin'), asyncHandler(transportController.createTransport))
        return this.router;
    }
}

module.exports = new TransportRoutes();