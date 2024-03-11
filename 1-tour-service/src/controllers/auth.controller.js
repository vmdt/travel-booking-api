const loginSchema = require("../schemes/auth/login");
const signupSchema = require("../schemes/auth/signup");
const { emailSchema, passwordSchema } = require('../schemes/auth/password');
const AuthService = require("../services/auth.service");
const { BadRequestError, AuthFailureError } = require("../utils/error.response");
const { CREATED, SuccessResponse } = require("../utils/sucess.response");
const { signToken } = require("../helpers/jwt");
const { omit } = require('../utils');

class AuthController {
    handleGoogleAuth = async (req, res, next) => {
        const user = req.user;
        if (req.user) {
            const token = signToken({
                id: user._id,
                role: user.role
            });
            new SuccessResponse({
                message: 'Log in by google successfully',
                metadata: {
                    user: omit(user.toObject(), ['googleId']),
                    access_token: token
                }
            }).send(res);
        } else {
            throw new AuthFailureError('Unauthenticated');
        }
    }

    signup = async (req, res, next) => {
        const { error } = await Promise.resolve(signupSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        return new CREATED({
            message: 'Sign up successfully',
            metadata: await AuthService.signup(req.body)
        }).send(res);
    }

    login = async (req, res, next) => {
        const { error } = await Promise.resolve(loginSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        return new SuccessResponse({
            message: 'Log in successfully',
            metadata: await AuthService.login(req.body)
        }).send(res);
    }

    verifyEmail = async (req, res, next) => {
        const { token } = req.body;
        return new SuccessResponse({
            message: 'Email verified successfully',
            metadata: await AuthService.verifyEmail(token)
        }).send(res);
    }

    forgotPassword = async (req, res, next) => {
        const { error } = await Promise.resolve(emailSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        const { email } = req.body;
        return new SuccessResponse({
            message: 'Password reset email sent',
            metadata: await AuthService.forgotPassword(email)
        }).send(res);
    }

    resetPassword = async (req, res, next) => {
        const { error } = await Promise.resolve(passwordSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        return new SuccessResponse({
            message: 'Password successfully updated',
            metadata: await AuthService.resetPassword({
                token: req.params.token,
                ...req.body
            })
        }).send(res);
    }

    sendVerification = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Verification email sent successfully',
            metadata: await AuthService.sendVerification(req.user)
        }).send(res);
    }

    banUser = async (req, res, next) => {
        return new SuccessResponse({
            message: 'User was banned successfully',
            metadata: await AuthService.banUser(req.params.userId)
        }).send(res);
    }

    unBanUser = async (req, res, next) => {
        return new SuccessResponse({
            message: 'User was actived successfully',
            metadata: await AuthService.unBanUser(req.params.userId)
        }).send(res);
    }
}

module.exports = new AuthController();