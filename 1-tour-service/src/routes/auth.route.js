const express = require('express');
const asyncHandler = require('../helpers/async.handler');
const authController = require('../controllers/auth.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

class AuthRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.post('/signup', asyncHandler(authController.signup));
        this.router.post('/login', asyncHandler(authController.login));
        this.router.put('/verify-email', asyncHandler(authController.verifyEmail));
        this.router.put('/forgot-password', asyncHandler(authController.forgotPassword));
        this.router.put('/reset-password/:token', asyncHandler(authController.resetPassword));

        this.router.use(protect);
        this.router.get('/send-verification', asyncHandler(authController.sendVerification));
        this.router.patch('/ban-user/:userId', restrictTo('admin'), asyncHandler(authController.banUser));
        this.router.patch('/active-user/:userId', restrictTo('admin'), asyncHandler(authController.unBanUser));
        return this.router;
    }
}

module.exports = new AuthRoutes();