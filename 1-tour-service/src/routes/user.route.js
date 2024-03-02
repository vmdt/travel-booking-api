const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const asyncHandler = require('../helpers/async.handler');

class UserRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.patch('/profile/:profileId', protect, asyncHandler(userController.updateProfile));
        this.router.get('/my-profile', protect, asyncHandler(userController.getMyProfile));
        this.router.get('/:userId', asyncHandler(userController.getUserByUserId));
        return this.router;
    }
}

module.exports = new UserRoutes();