const { Types } = require("mongoose");
const TourAvailabilitiesModel = require('../models/tourAvailabilities.model');
const { findOne } = require("../models/discount.model");
const TourModel = require('../models/tour.model');
const { getOne } = require("../repositories/factory.repo");

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
        if (!avaiExisting) {
            const tour = await getOne(TourModel, { _id: new Types.ObjectId(tourId) }, true);
            await TourAvailabilitiesModel.create({
                tour: new Types.ObjectId(tourId),
                startDate,
                vacancies: tour.defaultVacancies || 20
            });
        }
        const query = {
            tour: new Types.ObjectId(tourId),
            startDate,
            vacancies: { $gte: quantity }
        }, update = {
            $inc: { vacancies: -quantity }
        }, options = { new: true };

        return await TourAvailabilitiesModel.findOneAndUpdate(query, update, options);
    }

    static createTourAvailabilities = async ({ tourId, vacancies }) => {
        const bulkOps = Object.entries(vacancies).map(([date, vacancy]) => ({
            updateOne: {
                filter: { tour: new Types.ObjectId(tourId), startDate: date },
                update: { $set: { vacancies: vacancy } },
                upsert: true
            }
        }));
        if (bulkOps.length === 0) return [];
        return await TourAvailabilitiesModel.bulkWrite(bulkOps);
    }

    static getVacanciesByTour = async (tourId, startDate, endDate) => {
        const query = {
            tour: new Types.ObjectId(tourId)
        };
        if (startDate && endDate) {
            query.startDate = { $gte: startDate, $lte: endDate };
        }
        const results = await TourAvailabilitiesModel.find(query).lean();
        const formatted = {};
        results.forEach(item => {
            const date = new Date(item.startDate);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const key = `${yyyy}-${mm}-${dd}`;
            formatted[key] = item.vacancies;
        });
        return formatted;
    }
}

module.exports = TourAvailabilitiesService;