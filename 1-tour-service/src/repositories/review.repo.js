const { Types } = require('mongoose');
const ReviewModel = require('../models/review.model');

const aggregateReview = async (tourId) => {
    const reviews = await ReviewModel.aggregate([
        {
            $match: { 
                tour: new Types.ObjectId(tourId),
                isHidden: false,
                approve: true 
            }
        },
        {
            $group: {
                _id: "$tour",
                numOfRating: { $sum: 1 },
                ratingAverage: { $avg: "$rating" }
            }
        }
    ]);

    return reviews;
}

module.exports = {
    aggregateReview
}