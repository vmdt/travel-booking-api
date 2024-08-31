const { Types } = require("mongoose");
const TourAvailabilitiesModel = require('../models/tourAvailabilities.model');
const { findOne } = require("../models/discount.model");

class TourAvailabilitiesService {
    static checkAvailability = async ({ tourId, startDate, quantity }) => {
        const query = {
            tour: new Types.ObjectId(tourId),
            startDate,
            vacancies: { $gte: quantity }
        };
        const avai = await findOne(query).lean();
        return avai ? true : false;
    }

    static reservationTour = async ({ tourId, startDate, quantity }) => {
        const avaiExisting = await TourAvailabilitiesModel.findOne({
            tour: new Types.ObjectId(tourId),
            startDate
        }).lean();
        if (!avaiExisting)
            await TourAvailabilitiesModel.create({
                tour: new Types.ObjectId(tourId),
                startDate,
            });
        const query = {
            tour: new Types.ObjectId(tourId),
            startDate,
            vacancies: { $gte: quantity }
        }, update = {
            $inc: { vacancies: -quantity }
        }, options = { new: true };

        return await TourAvailabilitiesModel.findOneAndUpdate(query, update, options);
    }
}

module.exports = TourAvailabilitiesService;