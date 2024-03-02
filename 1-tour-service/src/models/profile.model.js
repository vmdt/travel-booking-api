const mongoose = require('mongoose');
const config = require('../config');

const Profile = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fullname: String,
    profilePicture: {
        type: String,
        default: `${config.PROFILE_PICTURE_DEFAULT}`
    },
    profilePublishId: String,
    gender: String,
    dateOfBirth: String,
    address: String,
    nationality: {
        type: String,
        default: 'Việt Nam'
    },
    phone: String,
    passport: String,
    dateOfIssuePassport: String,
    dateOfExpirationPassport: String
});

const ProfileModel = mongoose.model('Profile', Profile);

module.exports = ProfileModel;