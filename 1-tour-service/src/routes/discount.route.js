const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const asyncHandler = require('../helpers/async.handler');
const discountController = require('../controllers/discount.controller');

class DiscountRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.get('/list-tours/:code', asyncHandler(discountController.getToursByDiscountCode))
        this.router.get('/active-discounts/all', protect, restrictTo('admin'), asyncHandler(discountController.getActiveDiscounts))
        this.router.get('/inactive-discounts/all', protect, restrictTo('admin'), asyncHandler(discountController.getInactiveDiscounts))
        this.router.post('/activate/:discountId', protect, restrictTo('admin'), asyncHandler(discountController.activateDiscount))
        this.router.post('/deactivate/:discountId', protect, restrictTo('admin'), asyncHandler(discountController.deactivateDiscount))
        this.router.post('/amount', asyncHandler(discountController.getDiscountAmount));

        this.router.use(protect)
        this.router.get('/search/:code', restrictTo('admin'), asyncHandler(discountController.searchDiscount));
        this.router.route('/:discountId')
                    .post(restrictTo('admin'), asyncHandler(discountController.updateDiscount))
                    .get(asyncHandler(discountController.getDiscountById))
        
        this.router.route('/')
                    .post(restrictTo('admin'), asyncHandler(discountController.createDiscount))
                    .get(asyncHandler(discountController.getAllDiscounts));
        return this.router;
    }
}

module.exports = new DiscountRoutes();