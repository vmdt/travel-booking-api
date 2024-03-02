const _ = require('lodash');

const { omit, isDataURL } = require('../utils');
const { getProfileByUserId } = require("../repositories/profile.repo");
const { getUserById, aggreUserProfile } = require('../repositories/user.repo');
const { NotFoundError, BadRequestError } = require("../utils/error.response");
const { getOne, updateOne } = require('../repositories/factory.repo');
const UserModel = require('../models/user.model');
const ProfileModel = require('../models/profile.model');
const { upload } = require('../helpers/cloudinary');
const { Types } = require('mongoose');

class UserService {
    static getProfileByUserId = async (userId) => {
        const userExisting = await UserModel.findById(
            new Types.ObjectId(userId)
        ).lean();
        if (!userExisting)
            throw new NotFoundError('User does not exist');
        if (!userExisting.isActive)
            throw new BadRequestError('User has been banned');

        const profile = await getProfileByUserId(userId, {
            path: 'user',
            select: 'username email role'
        });
        if (!profile)
            throw new NotFoundError('Profile belonging to this user id does not exist');
        return { profile: profile.toObject() };
    }

    static getProfileById = async (profileId) => {
        const userExisting = await UserModel.findOne({
            profile: new Types.ObjectId(profileId)
        }).lean();
        if (!userExisting)
            throw new NotFoundError('User does not exist');
        if (!userExisting.isActive)
            throw new BadRequestError('User has been banned');

        const profile = await getOne(
            ProfileModel,
            { _id: profileId },
            {
                path: 'user',
                select: '-password -emailVerificationToken -passwordResetToken -passwordResetExpires'
            }
        );
        return {
            profile: profile.toObject()
        }
    }

    static getUserByUserId = async (userId) => {
        const userExisting = await UserModel.findById(
            new Types.ObjectId(userId)
        ).lean();
        if (!userExisting)
            throw new NotFoundError('Not found user');

        if (!userExisting.isActive)
            throw new BadRequestError('User has been banned');
        const user = await aggreUserProfile(userId);
        return {
            user: _.omit(user[0], [
                'password',
                'emailVerificationToken', 
                'passwordResetToken', 
                'passwordResetExpires'])
        }
    }

    static updateProfileById = async (profileId, payload) => {
        const userExisting = await UserModel.findOne({
            profile: new Types.ObjectId(profileId)
        }).lean();
        if (!userExisting)
            throw new NotFoundError('User does not exist');
        if (!userExisting.isActive)
            throw new BadRequestError('User has been banned');

        if (payload.profilePicture && isDataURL(payload.profilePicture)) {
            const profileExisting = await ProfileModel.exists({ _id: new Types.ObjectId(profileId) });
            if (!profileExisting) throw new NotFoundError("Profile's user does not exist with that id");
            const uploadResult = await upload(payload.profilePicture, { overwrite: true, invalidate: true, public_id: profileExisting?.profilePublishId });
            if (!uploadResult.public_id) {
                throw new BadRequestError('File upload error');
            }
            payload.profilePicture = uploadResult?.secure_url;
            payload.profilePublishId = uploadResult?.public_id;
        }     
        const profile = await updateOne(
            ProfileModel,
            {
                _id: profileId
            },
            payload
        );
        return {
            profile
        }
    }
}

module.exports = UserService;

