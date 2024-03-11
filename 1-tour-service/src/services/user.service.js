const _ = require('lodash');
const { Types } = require('mongoose');
const UserModel = require('../models/user.model');
const { getAll, updateOne, getOne } = require('../repositories/factory.repo');

class UserService {
    static getAllUsers = async (query) => {
        const users = await getAll(UserModel, query, true);
        return {
            result: users.length,
            users: _.omit(users, ['password'])
        }
    }

    static updateUser = async (userId, payload) => {
        const user = await updateOne(UserModel, {
            _id: new Types.ObjectId(userId)
        }, payload);

        return { user: user.toObject() }
    }

    static getUser = async (userId) => {
        const user = await getOne(UserModel, {
            _id: new Types.ObjectId(userId)
        }, true);
        return { user: _.omit(user, ['password']) }
    }
}

module.exports = UserService;

