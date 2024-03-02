const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const cartController = require('../controllers/cart.controller');
const asyncHandler = require('../helpers/async.handler');

class CartRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.use(protect)
        this.router.post('/update', asyncHandler(cartController.updateCart));
        this.router.route('/')
                    .get(asyncHandler(cartController.getListCart))
                    .post(asyncHandler(cartController.addToCart))
                    .delete(asyncHandler(cartController.deleteCartItem));

        return this.router;
    }
}

module.exports = new CartRoutes();