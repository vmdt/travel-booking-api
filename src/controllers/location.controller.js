const { locationSchema, updateLocationSchema } = require("../schemes/location");
const LocationService = require("../services/location.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response")

class LocationController {
    getAllLocations = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get locations successfully',
            metadata: await LocationService.getAllLocations(req.query)
        }).send(res);
    }

    getLocationById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get location successfully',
            metadata: await LocationService.getLocationById(req.params.locId)
        }).send(res);
    }

    updateLocation = async (req, res, next) => {
        const { error } = await Promise.resolve(updateLocationSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);
        new SuccessResponse({
            message: 'Update location successfully',
            metadata: await LocationService.updateLocation(req.params.locId, req.body)
        }).send(res);
    }

    searchLocation = async (req, res, next) => {
        new SuccessResponse({
            message: 'Searching response',
            metadata: await LocationService.searchLocation(req.params)
        }).send(res);
    }

    createLocation = async (req, res, next) => {
        const { error } = await Promise.resolve(locationSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);
        new SuccessResponse({
            message: 'Create Location Successfully',
            metadata: await LocationService.createLocation(req.body)
        }).send(res);
    }

    deleteLocation = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Location Successfully',
            metadata: await LocationService.deleteLocation(req.params.locId)
        }).send(res);
    }
}

module.exports = new LocationController();