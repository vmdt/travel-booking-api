const { createConnection } = require("./connection");
const config = require("../config");
const { sendMail } = require("../helpers/email");

const EXCHANGE_AUTH = "travel-auth";
const ROUTING_KEY_AUTH = "auth";
const QUEUE_AUTH = "auth-queue";

const consumeAuthEmailMessage = async (channel) => {
	try {
		if (!channel) channel = await createConnection();
		await channel.assertExchange(EXCHANGE_AUTH, "direct");
		const authQueue = await channel.assertQueue(QUEUE_AUTH, { durable: true });
		await channel.bindQueue(authQueue.queue, EXCHANGE_AUTH, ROUTING_KEY_AUTH);

		channel.consume(authQueue.queue, async (msg) => {
			const { receiver, verifyLink, template, username, resetLink, otpCode } =
				JSON.parse(msg.content.toString());
			const locals = {
				appLink: `${config.CLIENT_URL}`,
				appIcon:
					"https://res.cloudinary.com/dxrygyw5d/image/upload/v1709968499/travelife-logo_uf55mo.png",
				username,
				verifyLink,
				resetLink,
				otpCode,
			};

			await sendMail(template, receiver, locals);
			channel.ack(msg);
		});
	} catch (error) {
		console.log("Consume Auth Email Error", error);
	}
};

module.exports = {
	consumeAuthEmailMessage,
};
