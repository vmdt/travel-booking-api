const { createOne, getAll, getOne } = require("../repositories/factory.repo");
const InterestModel = require('../models/interest.model');
const { Types } = require("mongoose");
const { BadRequestError } = require("../utils/error.response");

class InterestService {
    static createInterest = async ({
        name, image, icon, isActive = true
    }) => {
        const interest = await createOne(InterestModel, {
            name,
            image,
            icon,
            isActive
        });
        return {
            interest: interest.toObject()
        }
    }

    static getAllInterests = async (query) => {
        const interests = await getAll(InterestModel, query);
        return {
            result: interests.length,
            interests
        }
    }

    static getInterestById = async (interestId) => {
        const interest = await getOne(InterestModel, {
            _id: new Types.ObjectId(interestId)
        });
        if (!interest || !interest.isActive)
            throw new BadRequestError('Not found interest');
        
        return {
            interest: interest.toObject()
        }
    }
}

module.exports = InterestService;