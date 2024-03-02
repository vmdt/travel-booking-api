const amqplib = require('amqplib');
const { createConnection } = require("./connection");
const config = require('../config');
const { sendMail } = require('../helpers');

const EXCHANGE_AUTH = 'travel-auth';
const ROUTING_KEY_AUTH = 'auth';
const QUEUE_AUTH = 'auth-queue'


const consumeAuthEmailMessage = async (channel) => {
    try {
        if (!channel)
            channel = await createConnection();
        await channel.assertExchange(EXCHANGE_AUTH, 'direct');
        const authQueue = await channel.assertQueue(QUEUE_AUTH, { durable: true });
        await channel.bindQueue(authQueue.queue, EXCHANGE_AUTH, ROUTING_KEY_AUTH);

        channel.consume(authQueue.queue, async (msg) => {
            const { receiver, verifyLink, template, username, resetLink } = JSON.parse(msg.content.toString());
            const locals = {
                appLink: `${config.CLIENT_URL}`,
                appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
                username,
                verifyLink,
                resetLink
            }

            await sendMail(template, receiver, locals);
            channel.ack(msg);
        });
    } catch (error) {
        console.log('Consume Auth Email Error', error);
    }
}

module.exports = {
    consumeAuthEmailMessage
}
