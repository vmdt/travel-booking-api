const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const asyncHandler = require('../helpers/async.handler');
const { uploadDisk } = require('../helpers/multer');

class UserRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.use(protect);
        this.router.route('/:userId')
                .get(asyncHandler(userController.getUser))
                .post(asyncHandler(userController.updateUser));
                

        this.router.use(restrictTo('admin'));            
        this.router.route('/')
                .post(asyncHandler(userController.createUserByAdmin))
                .get(asyncHandler(userController.getAllUsers));
        return this.router;
    }
}

module.exports = new UserRoutes();