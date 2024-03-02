const jwt = require('jsonwebtoken');
const config = require('../config');

const signToken = (payload) => {
    return jwt.sign(payload, config.JWT_TOKEN, {
        expiresIn: config.JWT_EXPIRES_IN
    });
}

module.exports = {
    signToken
}