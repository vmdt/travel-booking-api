const Joi = require("joi");

const emailSchema = Joi.object().keys({
	email: Joi.string().email().required().messages({
		"string.base": "Email must be of type string",
		"string.email": "Invalid email",
		"string.empty": "Email must not be empty",
	}),
});

const passwordSchema = Joi.object().keys({
	password: Joi.string().min(8).max(16).required().messages({
		"string.base": "Password must be of type string",
		"string.min": "Password must be at least 8 of characters",
		"string.max": "Password must be under 16 of characters",
		"string.empty": "Password is a required field",
	}),
	passwordConfirm: Joi.any().equal(Joi.ref("password")).required().messages({
		"any.only": "Password Confirmation does not match",
		"any.required": "Password Confirm is a required field",
	}),
});

const resetPasswordSchema = Joi.object().keys({
	email: Joi.string().email().required().messages({
		"string.base": "Email must be of type string",
		"string.email": "Invalid email",
		"string.empty": "Email must not be empty",
	}),
	otp: Joi.string().required().messages({
		"string.base": "OTP must be of type string",
		"string.empty": "OTP must not be empty",
	}),
	password: Joi.string().min(8).max(16).required().messages({
		"string.base": "Password must be of type string",
		"string.min": "Password must be at least 8 of characters",
		"string.max": "Password must be under 16 of characters",
		"string.empty": "Password is a required field",
	}),
	passwordConfirm: Joi.any().equal(Joi.ref("password")).required().messages({
		"any.only": "Password Confirmation does not match",
		"any.required": "Password Confirm is a required field",
	}),
});

module.exports = {
	emailSchema,
	passwordSchema,
	resetPasswordSchema,
};
