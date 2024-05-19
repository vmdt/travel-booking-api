const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const reviewController = require('../controllers/review.controller');
const asyncHandler = require('../helpers/async.handler');

class ReviewRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.get('/tour/:tourId', asyncHandler(reviewController.getReviewsByUser));
        this.router.use(protect);
        this.router.patch('/:reviewId', asyncHandler(reviewController.updateReview));
        this.router.post('/', asyncHandler(reviewController.createReview));
    
        
        this.router.use(restrictTo('admin'));
        this.router.get('/approve/:reviewId', asyncHandler(reviewController.approveReview));
        this.router.get('/details/:reviewId', asyncHandler(reviewController.getReview));
        this.router.delete('/:reviewId', asyncHandler(reviewController.deleteReview));
        this.router.get('/', asyncHandler(reviewController.getAllReviewsByAdmin));

        return this.router;
    }
}

module.exports = new ReviewRoutes();