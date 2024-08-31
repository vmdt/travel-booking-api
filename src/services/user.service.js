const _ = require('lodash');
const { Types } = require('mongoose');
const UserModel = require('../models/user.model');
const { getAll, updateOne, getOne } = require('../repositories/factory.repo');
const { NotFoundError, BadRequestError } = require('../utils/error.response');
const { isDataURL } = require('../utils');
const { upload } = require('../helpers/cloudinary');
const { getUserByUsernameOrEmail } = require('../repositories/user.repo');

class UserService {
    static getAllUsers = async (query) => {
        let {total, docs: users} = await getAll(UserModel, query, true);
        users = users.map(user => _.omit(user, ['password']));
        return {
            total,
            result: users.length,
            users
        }
    }

    static updateUser = async (userId, payload) => {
        const { profilePicture } = payload;
        if (isDataURL(profilePicture)) {
            const profileResult = await upload(profilePicture, {
                public_id: `${userId}`,
                folder: 'travelife/user',
                overwrite: true,
                invalidate: true
            });
            payload.profilePicture = profileResult?.secure_url;
        }

        const user = await updateOne(UserModel, {
            _id: new Types.ObjectId(userId)
        }, payload);

        if (!user)
            throw new NotFoundError('Not found user');

        return { user: user.toObject() }
    }

    static getUser = async (userId) => {
        const user = await getOne(UserModel, {
            _id: new Types.ObjectId(userId)
        }, true);
        return { user: _.omit(user, ['password']) }
    }

    static createUserByAdmin = async (payload) => {
        const userExisting = await getUserByUsernameOrEmail(payload.username, payload.email);
        if (userExisting)
            throw new BadRequestError('Username or email already exists');
        if (!payload.passwordConfirm) {
            payload.passwordConfirm = payload.password;
        }

        payload.emailVerified = true;

        const user = await UserModel.create(payload);
        return { user: user.toObject() }
    }

}

module.exports = UserService;

