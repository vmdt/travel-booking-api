const profileSchema = require("../schemes/user/profile");
const UserService = require("../services/user.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response")

class UserController {
    getMyProfile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get profile user successfully',
            metadata: await UserService.getProfileByUserId(req.user._id)
        }).send(res);
    }

    getProfileById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get profile by id successfully',
            metadata: await UserService.getProfileById(req.params.profileId)
        }).send(res);
    }

    getUserByUserId = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get user by id successfully',
            metadata: await UserService.getUserByUserId(req.params.userId)
        }).send(res);
    }

    updateProfile = async (req, res, next) => {
        const { error } = await Promise.resolve(profileSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);
        new SuccessResponse({
            message: 'Update profile successfully',
            metadata: await UserService.updateProfileById(req.params.profileId, req.body)
        }).send(res);
    }
}

module.exports = new UserController();