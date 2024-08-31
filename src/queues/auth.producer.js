const { createConnection } = require("./connection");

const publishDirectMessage = async (
    channel,
    exchangeName,
    routingKey,
    message
) => {
    try {
        if (!channel)
            channel = await createConnection();

        await channel.assertExchange(exchangeName, 'direct');
        channel.publish(exchangeName, routingKey, Buffer.from(message));
    } catch (error) {
        console.log('Publish direct message error', error);
    }
}

module.exports = {
    publishDirectMessage
}