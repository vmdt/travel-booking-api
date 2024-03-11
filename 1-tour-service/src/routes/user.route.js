const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const asyncHandler = require('../helpers/async.handler');

class UserRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.route('/:userId')
                .get(asyncHandler(userController.getUser))
                .patch(asyncHandler(userController.updateUser));

        this.router.use([protect, restrictTo('admin')])
        this.router.route('/')
                .get(asyncHandler(userController.getAllUsers));
        return this.router;
    }
}

module.exports = new UserRoutes();