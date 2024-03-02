const { Types } = require('mongoose');
const ProfileModel = require('../models/profile.model');

const getProfileByUserId = async (userId, popOptions = {}) => {
    const profile = await ProfileModel.findOne({
        user: new Types.ObjectId(userId)
    }).populate(popOptions);
    return profile;
}

module.exports = {
    getProfileByUserId
}