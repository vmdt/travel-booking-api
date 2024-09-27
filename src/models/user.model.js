const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../config");

const SALT_ROUND = 10;

const User = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			index: true,
		},
		password: {
			type: String,
		},
		passwordConfirm: {
			type: String,
			validate: {
				validator: function (pwc) {
					return pwc === this.password;
				},
			},
		},
		role: {
			type: String,
			enum: ["user", "admin", "guide"],
			default: "user",
		},
		emailVerificationToken: String,
		emailVerified: { type: Boolean, default: false },
		passwordResetToken: String,
		passwordResetExpires: Date,
		passwordChangedAt: Date,
		isActive: {
			type: Boolean,
			default: true,
		},
		lastSignInAt: Date,
		fullname: String,
		profilePicture: {
			type: String,
			default: `${config.PROFILE_PICTURE_DEFAULT}`,
		},
		profilePublishId: String,
		gender: String,
		dateOfBirth: String,
		address: String,
		nationality: {
			type: String,
			default: "Việt Nam",
		},
		phone: String,
		passport: String,
		dateOfIssuePassport: String,
		dateOfExpirationPassport: String,
		googleId: String,
		typeAuth: String,
		isVerifiedOTP: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

User.pre("save", async function (next) {
	if (!this.isModified("password")) next();
	this.password = await bcrypt.hash(this.password, SALT_ROUND);
	this.passwordConfirm = undefined;
	next();
});

User.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) return next();
	this.passwordChangedAt = Date.now();
	next();
});

User.methods.correctPassword = async function (candidate) {
	if (!this.password) return false;
	return await bcrypt.compare(candidate, this.password);
};

User.methods.passwordChangedAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const pwcTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return pwcTimestamp > JWTTimestamp;
	}
	return false;
};

const UserModel = mongoose.model("User", User);

module.exports = UserModel;
