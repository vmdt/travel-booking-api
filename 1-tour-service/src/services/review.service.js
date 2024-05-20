const { Types } = require('mongoose');
const ReviewModel = require('../models/review.model');
const UserModel = require("../models/user.model");
const TourModel = require('../models/tour.model');
const { getOne, createOne, getAll, getMany, updateOne, deleteOne } = require("../repositories/factory.repo");
const { NotFoundError } = require('../utils/error.response');
const { aggregateReview } = require('../repositories/review.repo');

class ReviewService {
    static createReview = async (payload) => {
        const popOptions = [{
            path: 'user',
            select: 'fullname username email profilePicture'
        }, {
            path: 'tour',
            select: 'code title thumbnail'
        }];

        const { user, tour } = payload;
        const userExisting = await getOne(UserModel, { _id: new Types.ObjectId(user) });
        if (!userExisting)
            throw new NotFoundError('Not found user');
        const tourExisting = await getOne(TourModel, { _id: new Types.ObjectId(tour) });
        if (!tourExisting)
            throw new NotFoundError('Not found tour');

        let review = await createOne(ReviewModel, {
            ...payload,
            reviewAt: Date.now()
        });

        review = await review.populate(popOptions);

        return { review }
    }

    static getAllReviewsByAdmin = async (query) => {
        const popOptions = [{
            path: 'user',
            select: 'fullname username email profilePicture'
        }, {
            path: 'tour',
            select: 'code title thumbnail'
        }];
        const {total, docs: reviews} = await getAll(ReviewModel, query, true, popOptions);

        return {
            total,
            result: reviews.length,
            reviews
        }
    }

    static getReviewsByUser = async (tourId, query) => {
        const popOptions = [{
            path: 'user',
            select: 'fullname username email profilePicture'
        }];
        const {total, docs: reviews} = await getMany(ReviewModel, {
            tour: new Types.ObjectId(tourId),
            isHidden: false,
            approve: true
        }, query, true, popOptions);

        return {
            total,
            result: reviews.length,
            reviews
        }
    }

    static approveReview = async (reviewId) => {
        const popOptions = [{
            path: 'user',
            select: 'fullname username email profilePicture'
        }, {
            path: 'tour',
            select: 'code title thumbnail'
        }];

        let review = await updateOne(ReviewModel, {
            _id: new Types.ObjectId(reviewId)
        }, { approve: true });
        if (!review)
            throw new NotFoundError('Not found review');

        const aggreateReview = await aggregateReview(review.tour);
        // update rating for tour
        await updateOne(TourModel, { _id: review.tour }, {
            numOfRating: aggreateReview[0].numOfRating,
            ratingAverage: Math.floor(aggreateReview[0].ratingAverage*10)/10
        });

        review = await review.populate(popOptions);
        return { review };
    }

    static updateReview = async (reviewId, payload) => {
        const popOptions = [{
            path: 'user',
            select: 'fullname username email profilePicture'
        }, {
            path: 'tour',
            select: 'code title thumbnail'
        }];
        let review = await updateOne(ReviewModel, {
            _id: new Types.ObjectId(reviewId)
        }, payload);
        if (!review)
            throw new NotFoundError('Not found review');

        review = await review.populate(popOptions);
        return { review }
    }

    static deleteReview = async (reviewId) => {
        const review = await deleteOne(ReviewModel, new Types.ObjectId(reviewId));
        if (!review)
            throw new NotFoundError('Not found review');

        return null;
    }

    static getReview = async (reviewId) => {
        const popOptions = [{
            path: 'user',
            select: 'fullname username email profilePicture'
        }, {
            path: 'tour',
            select: 'code title thumbnail'
        }];
        const review = await getOne(ReviewModel, new Types.ObjectId(reviewId), true, popOptions);
        if (!review)
            throw new NotFoundError('Not found review');

        return review;
    }
}

module.exports = ReviewService;
