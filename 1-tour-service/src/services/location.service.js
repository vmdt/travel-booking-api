const { Types } = require('mongoose');
const LocationModel = require('../models/location.model');
const { updateOne, getOne, getAll, deleteOne } = require('../repositories/factory.repo');
const { BadRequestError } = require('../utils/error.response');

class LocationService {
    static searchLocation = async ({ keyword }) => {
        const foundLocations = await LocationModel.find({
            name: { $regex: keyword, $options: 'i' }
        });
        return {
            result: foundLocations.length,
            locations: foundLocations
        }
    } 

    static createLocation = async ({ title, type, loc }) => {
        const location = await LocationModel.create({ title, type, loc });
        return { location };
    }

    static updateLocation = async (locId, payload) => {
        const location = await updateOne(LocationModel, { _id: new Types.ObjectId(locId) }, payload);
        if (!location)
            throw new BadRequestError('Not found location');
        return { location };
    }

    static getLocationById = async (locId) => {
        const location = await getOne(LocationModel, { _id: new Types.ObjectId(locId) });
        if (!location)
            throw new BadRequestError('Not found location');
        return {
            location
        }
    }

    static getAllLocations = async (query) => {
        const locations = await getAll(LocationModel, query);
        return {
            result: locations.length,
            locations
        };
    }

    static deleteLocation = async (locId) => {
        const location = await deleteOne(LocationModel, locId);
        if (!location)
            throw new BadRequestError('Not found location');
        return null;
    }
}

module.exports = LocationService;
