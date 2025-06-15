require("dotenv").config();
const mongoose = require("mongoose");


const reviewModel = require("../models/review.model");
const TourModel = require("../models/tour.model");
const { aggregateReview } = require("../repositories/review.repo");

const reviewTourMigration = async () => {
    await mongoose.connect(process.env.MONGO_URL);
    const tours = await TourModel.find({ isActive: true }).lean();
    for (const tour of tours) {
        let aggreateReview = await aggregateReview(tour._id);
        if (aggreateReview.length > 0) {
            await TourModel.updateOne(
                { _id: tour._id },
                {
                    numOfRating: aggreateReview[0].numOfRating,
                    ratingAverage: Math.floor(aggreateReview[0].ratingAverage * 10) / 10,
                }
            );
        }
    }
    console.log("Migration completed successfully.");
    await mongoose.disconnect();
    process.exit(0);
}

reviewTourMigration();