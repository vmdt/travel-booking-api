const crypto = require("crypto");
const _ = require("lodash");

const UserModel = require("../models/user.model");
const { BadRequestError, NotFoundError } = require("../utils/error.response");
const { publishDirectMessage } = require("../queues/auth.producer");
const { omit, isEmail } = require("../utils");
const config = require("../config");
const { signToken } = require("../helpers/jwt");
const {
	getUserByUsernameOrEmail,
	getUserByEmail,
	getUserByUsername,
	getUserByVerificationToken,
	getUserByPasswordResetToken,
	updateUserById,
} = require("../repositories/user.repo");
const { getOne } = require("../repositories/factory.repo");
const { Types } = require("mongoose");
const { generateOtp } = require("../repositories/otp.repo");
const EXCHANGE_AUTH = "travel-auth";
const ROUTING_AUTH = "auth";
const OTPModel = require("../models/otp.model");

class AuthService {
	static signup = async ({ username, email, password, passwordConfirm }) => {
		const checkUserExist = await getUserByUsernameOrEmail(username, email);
		if (checkUserExist)
			throw new BadRequestError("Username or email already exists");

		const randomBytes = await Promise.resolve(crypto.randomBytes(10));
		const randomCharacters = randomBytes.toString("hex");

		const response = await UserModel.create({
			username,
			email,
			password,
			passwordConfirm,
			emailVerificationToken: randomCharacters,
		});

		const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${response.emailVerificationToken}`;
		const messageDetails = {
			verifyLink: verificationLink,
			receiver: response.email,
			template: "verifyEmail",
		};

		// get channel instance
		const channel = await require("../server").channel;
		/*
            publish notify to notification service
        */
		await publishDirectMessage(
			channel,
			EXCHANGE_AUTH,
			ROUTING_AUTH,
			JSON.stringify(messageDetails),
		);

		const token = signToken({
			id: response._id,
			role: response.role,
		});

		response.lastSignInAt = Date.now();
		await response.save({ validateBeforeSave: false });

		return {
			user: { ...omit(response.toObject(), ["password"]) },
			accessToken: token,
		};
	};

	static login = async ({ email, password }) => {
		const isValidEmail = isEmail(email);
		const existUser = isValidEmail
			? await getUserByEmail(email)
			: await getUserByUsername(email);
		if (!existUser) throw new BadRequestError("Invalid username or email");

		if (!(await existUser.correctPassword(password)))
			throw new BadRequestError("Incorrect password");

		if (!existUser.isActive) throw new BadRequestError("User was banned");

		const token = signToken({
			id: existUser._id,
			role: existUser.role,
		});

		existUser.lastSignInAt = Date.now();
		await existUser.save({ validateBeforeSave: false });

		return {
			user: { ...omit(existUser.toObject(), ["password"]) },
			accessToken: token,
		};
	};

	static verifyEmail = async (token) => {
		const existUser = await getUserByVerificationToken(token);
		if (!existUser)
			throw new BadRequestError(
				"Verification token is invalid or is already used",
			);

		existUser.emailVerified = true;
		existUser.emailVerificationToken = undefined;
		await existUser.save({ validateBeforeSave: false });
		return {
			user: { ...omit(existUser.toObject(), ["password"]) },
		};
	};

	static forgotPassword = async (email) => {
		const existUser = await getUserByEmail(email);
		if (!existUser) throw new NotFoundError("User does not exist");

		const randomBytes = await Promise.resolve(crypto.randomBytes(10));
		const randomCharacters = randomBytes.toString("hex");
		const tokenExpiration = Date.now() + 10 * 60 * 1000;
		existUser.passwordResetToken = randomCharacters;
		existUser.passwordResetExpires = tokenExpiration;
		await existUser.save({ validateBeforeSave: false });

		const resetLink = `${config.CLIENT_URL}/reset_password?token=${randomCharacters}`;
		const messageDetails = {
			receiver: existUser.email,
			resetLink,
			username: existUser.username,
			template: "forgotPassword",
		};

		const channel = await require("../server").channel;
		await publishDirectMessage(
			channel,
			EXCHANGE_AUTH,
			ROUTING_AUTH,
			JSON.stringify(messageDetails),
		);
	};

	static changePassword = async (userId, payload) => {
		const { currentPassword, newPassword, newPasswordConfirm } = payload;
		const userExisting = await getOne(
			UserModel,
			{
				_id: new Types.ObjectId(userId),
			},
			false,
		);
		if (!userExisting) throw new NotFoundError("Not found user");
		const match = await userExisting.correctPassword(currentPassword);
		if (!match) throw new BadRequestError("Current password is incorrect");
		userExisting.password = newPassword;
		userExisting.passwordConfirm = newPasswordConfirm;
		await userExisting.save();
		const token = signToken({
			id: userExisting._id,
			role: userExisting.role,
		});

		return {
			user: { ...omit(userExisting.toObject(), ["password"]) },
			accessToken: token,
		};
	};

	static resetPassword = async ({ token, password, passwordConfirm }) => {
		const user = await getUserByPasswordResetToken(token);
		if (!user) throw new BadRequestError("Token is invalid or has expired");

		user.password = password;
		user.passwordConfirm = passwordConfirm;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: true });

		const messageDetails = {
			username: user.username,
			template: "resetPasswordSuccess",
		};
		const channel = await require("../server").channel;
		await publishDirectMessage(
			channel,
			EXCHANGE_AUTH,
			ROUTING_AUTH,
			JSON.stringify(messageDetails),
		);
	};

	static sendVerification = async (user) => {
		const randomBytes = await Promise.resolve(crypto.randomBytes(10));
		const randomCharacters = randomBytes.toString("hex");
		user.emailVerificationToken = randomCharacters;
		await user.save({ validateBeforeSave: false });

		const channel = await require("../server").channel;
		const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${user.emailVerificationToken}`;
		const messageDetails = {
			verifyLink: verificationLink,
			receiver: user.email,
			template: "verifyEmail",
		};
		await publishDirectMessage(
			channel,
			EXCHANGE_AUTH,
			ROUTING_AUTH,
			JSON.stringify(messageDetails),
		);
	};

	static banUser = async (userId) => {
		const user = await updateUserById({
			userId,
			update: {
				isActive: false,
			},
		});
		if (!user) throw new NotFoundError("User does not exist");
		return _.pick(user.toObject(), ["_id", "email", "username", "isActive"]);
	};

	static unBanUser = async (userId) => {
		const user = await updateUserById({
			userId,
			update: {
				isActive: true,
			},
		});
		if (!user) throw new NotFoundError("User does not exist");
		return omit(user.toObject(), ["password"]);
	};

	static resetPasswordMobile = async ({
		email,
		password,
		passwordConfirm,
		otp,
	}) => {
		const user = await UserModel.findOne({ email });
		if (!user) throw new BadRequestError("User does not exist");

		const otpExist = await OTPModel.findOne({ email, otp });
		if (!otpExist) throw new BadRequestError("Invalid OTP code");

		user.password = password;
		user.passwordConfirm = passwordConfirm;
		user.isVerifiedOTP = false;
		await user.save({ validateBeforeSave: true });

		return null;
	};
}

module.exports = AuthService;
