const tourTypeSchema = require("../schemes/tour/tourType");
const InterestService = require("../services/interest.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response");

class InterestController {
    createInterest = async (req, res, next) => {
        const { error } = await Promise.resolve(tourTypeSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        new SuccessResponse({
            message: 'Create interest successfully',
            metadata: await InterestService.createInterest(req.body)
        }).send(res);
    }

    getAllInterests = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all interests successfully',
            metadata: await InterestService.getAllInterests(req.query)
        }).send(res);
    }

    getInterestById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get interest successfully',
            metadata: await InterestService.getInterestById(req.params.interestId)
        }).send(res);
    }
}

module.exports = new InterestController();