const { Types } = require('mongoose');
const UserModel = require('../models/user.model');

const getUserByUsernameOrEmail = async (username, email) => {
    const user = await UserModel.findOne({
        $or: [ {username}, {email} ]
    });
    return user;
}

const getUserByUsername = async (username) => {
    return await UserModel.findOne({
        username
    });
}

const getUserByEmail = async (email) => {
    return await UserModel.findOne({
        email
    });
}

const getUserByVerificationToken = async (token) => {
    return await UserModel.findOne({
        emailVerificationToken: token
    });
}

const getUserById = async (userId) => {
    return await UserModel.findById(userId);
}


const getUserByPasswordResetToken = async (token) => {
    return await UserModel.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
    });
}

const updateUserById = async ({ userId, update, isNew = true }) => {
    const user = await UserModel.findByIdAndUpdate(
        new Types.ObjectId(userId),
        update, {
            new: isNew
        }
    );
    return user;
}


module.exports = {
    getUserByUsernameOrEmail,
    getUserByUsername,
    getUserByEmail,
    getUserByVerificationToken,
    getUserById,
    getUserByPasswordResetToken,
    updateUserById
}