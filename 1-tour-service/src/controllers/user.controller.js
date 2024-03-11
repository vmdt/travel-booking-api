const profileSchema = require("../schemes/user/profile");
const UserService = require("../services/user.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response")

class UserController {
    getAllUsers = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all users successfully',
            metadata: await UserService.getAllUsers(req.query)
        }).send(res);
    }

    updateUser = async (req, res, next) => {
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
}

module.exports = new UserController();