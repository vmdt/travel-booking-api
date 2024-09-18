const otpGenerator = require("otp-generator");
const OTPModel = require("../models/otp.model");

const generateOtp = async (email) => {
	let otp = otpGenerator.generate(6, {
		digits: true,
		upperCaseAlphabets: false,
		specialChars: false,
		lowerCaseAlphabets: false,
	});

	let result = await OTPModel.findOne({ otp: otp });
	while (result) {
		otp = otpGenerator.generate(6, {
			digits: true,
			upperCaseAlphabets: false,
			specialChars: false,
			lowerCaseAlphabets: false,
		});
		result = await OTPModel.findOne({ otp: otp });
	}

	const createdOTP = await OTPModel.findOneAndUpdate(
		{ email },
		{ otp },
		{ upsert: true, new: true },
	);

	return createdOTP;
};

module.exports = {
	generateOtp,
};
