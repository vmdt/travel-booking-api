const { reviewSchema, updateReviewSchema } = require("../schemes/review");
const ReviewService = require("../services/review.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response");

class ReviewController {
    createReview = async (req, res, next) => {
        const { error } = await Promise.resolve(reviewSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        new SuccessResponse({
            message: 'Create review successfully',
            metadata: await ReviewService.createReview(req.body)
        }).send(res);
    }

    getAllReviewsByAdmin = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all reviews successfully',
            metadata: await ReviewService.getAllReviewsByAdmin(req.query)
        }).send(res);
    }

    getReviewsByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get reviews successfully',
            metadata: await ReviewService.getReviewsByUser(req.params.tourId, req.query)
        }).send(res);
    }

    approveReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Approve review successfully',
            metadata: await ReviewService.approveReview(req.params.reviewId)
        }).send(res);
    }

    updateReview = async (req, res, next) => {
        const { error } = await Promise.resolve(updateReviewSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        new SuccessResponse({
            message: 'Update review successfully',
            metadata: await ReviewService.updateReview(req.params.reviewId, req.body)
        }).send(res);
    }

    deleteReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete review successfully',
            metadata: await ReviewService.deleteReview(req.params.reviewId)
        }).send(res);
    }

    getReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get review successfully',
            metadata: await ReviewService.getReview(req.params.reviewId)
        }).send(res);
    }
}

module.exports = new ReviewController();