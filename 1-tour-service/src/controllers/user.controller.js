const { upload } = require("../helpers/cloudinary");
const { getUserById } = require("../repositories/user.repo");
const { profileSchema, createUserSchema } = require("../schemes/user/profile");
const UserService = require("../services/user.service");
const { BadRequestError, NotFoundError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response")

class UserController {
    getAllUsers = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all users successfully',
            metadata: await UserService.getAllUsers(req.query)
        }).send(res);
    }

    updateUser = async (req, res, next) => {
        const { error } = await Promise.resolve(profileSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        new SuccessResponse({
            message: 'Update user successfully',
            metadata: await UserService.updateUser(req.params.userId, req.body)
        }).send(res);
    }

    getUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get user successfully',
            metadata: await UserService.getUser(req.params.userId)
        }).send(res);
    }

    createUserByAdmin = async (req, res, next) => {
        const { error } = await Promise.resolve(createUserSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        new SuccessResponse({
            message: 'Create user successfully',
            metadata: await UserService.createUserByAdmin(req.body)
        }).send(res);
    }
}

module.exports = new UserController();