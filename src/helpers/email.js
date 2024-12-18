const path = require("path");
const nodemailer = require("nodemailer");
const Email = require("email-templates");
const { google } = require("googleapis");
const config = require("../config");

const CLIENT_ID = config.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = config.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = config.GOOGLE_REDIRECT_URL;
const REFRESH_TOKEN = config.GOOGLE_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URL,
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(template, receiver, locals) {
	try {
		const transport = nodemailer.createTransport({
			service: "gmail",
			host: config.HOST_MAIL,
			port: config.PORT_MAIL,
			auth: {
				user: config.USER_MAIL,
				pass: config.USER_MAIL_PASS,
			},
		});

		const email = new Email({
			message: {
				from: `Travelife Website <${config.SENDER_MAIL}>`,
			},
			send: true,
			transport,
			views: {
				options: {
					extension: "ejs",
				},
			},
			juice: true,
			juiceResources: {
				preserveImportant: true,
				webResources: {
					relativeTo: path.join(__dirname, "../build"),
				},
			},
		});

		await email.send({
			template: path.join(__dirname, "..", "/emails", template),
			message: { to: receiver },
			locals,
		});
	} catch (error) {
		console.log("Send mail error", error);
	}
}

module.exports = {
	sendMail,
};
