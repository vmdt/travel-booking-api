const express = require("express");
const passport = require("passport");
const asyncHandler = require("../helpers/async.handler");
const authController = require("../controllers/auth.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const PassportConfig = require("../helpers/passport");

class AuthRoutes {
	constructor() {
		this.router = express.Router();
		new PassportConfig(passport).google();
	}

	routes() {
		this.router.get(
			"/google",
			passport.authenticate("google", { scope: ["email", "profile"] }),
		);
		this.router.get(
			"/google/callback",
			passport.authenticate("google", { session: false }),
			asyncHandler(authController.handleGoogleAuth),
		);

		this.router.post("/signup", asyncHandler(authController.signup));
		this.router.post("/login", asyncHandler(authController.login));
		this.router.put("/verify-email", asyncHandler(authController.verifyEmail));
		this.router.put(
			"/forgot-password",
			asyncHandler(authController.forgotPassword),
		);
		this.router.put(
			"/reset-password/:token",
			asyncHandler(authController.resetPassword),
		);

		this.router.put(
			"/reset-password-mobile",
			asyncHandler(authController.resetPasswordMobile),
		);
		this.router.post("/send-otp", asyncHandler(authController.sendOTP));
		this.router.post("/verify-otp", asyncHandler(authController.verifyOTP));

		this.router.use(protect);
		this.router.post(
			"/change-password",
			asyncHandler(authController.changePassword),
		);
		this.router.get(
			"/send-verification",
			asyncHandler(authController.sendVerification),
		);
		this.router.patch(
			"/ban-user/:userId",
			restrictTo("admin"),
			asyncHandler(authController.banUser),
		);
		this.router.patch(
			"/active-user/:userId",
			restrictTo("admin"),
			asyncHandler(authController.unBanUser),
		);
		return this.router;
	}
}

module.exports = new AuthRoutes();
