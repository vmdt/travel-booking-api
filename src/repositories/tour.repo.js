const { Types } = require('mongoose');
const TourModel = require('../models/tour.model');
const { getAll } = require('./factory.repo');

const createTour = async (payload, ...popOptions) => {
    let tour = await TourModel.create(payload);
    tour = await tour.populate(popOptions);
    return tour;
}

const getAllTours = async (query, ...popOptions) => {
    const tours = await getAll(TourModel, query, popOptions);
    return tours;
}

const updateTourById = async (tourId, payload, isNew = true) => {
    const tour = await TourModel.findByIdAndUpdate(new Types.ObjectId(tourId),
        payload, { new: isNew });
    return tour;
}

const getCodeByTourId = async (tourId) => {
    const tour = await TourModel.findById(new Types.ObjectId(tourId)).lean();
    return tour.code;
}

module.exports = {
    createTour,
    getAllTours,
    updateTourById,
    getCodeByTourId
}