const jwt = require('jsonwebtoken');
const { promisify } = require('node:util');
const config = require('../config');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../utils/error.response');
const { getUserById } = require('../repositories/user.repo');

const protect = async (req, res, next) => {
    let token = '';
    if (req.headers?.authorization && 
        req.headers?.authorization.startsWith('Bearer')) {
            token = req.headers?.authorization.split(' ')[1];
    }

    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, config.JWT_TOKEN);
    } catch (error) {
        return next(new AuthFailureError('Invalid token. Please login again'));
    }
    
    const currentUser = await getUserById(decoded.id);
    if (!currentUser)
        return next(new AuthFailureError('Token does not belong user'));

    if (currentUser.passwordChangedAfter(decoded.iat))
        return next(new AuthFailureError('User recently changed password. Please login again'));

    if (!currentUser.isActive)
        return next(new AuthFailureError('User was banned'));

    req.user = currentUser;
    next();
}

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            throw new ForbiddenError('You do not have permission to access this action');
        next();
    }
}

module.exports = {
    protect,
    restrictTo
}