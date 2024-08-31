const amqplib = require('amqplib');
const config = require('../config');

const createConnection = async () => {
    try {
        const connection = await amqplib.connect(`${config.RABBITMQ_ENDPOINT}`);
        const channel = await connection.createChannel();
        if (channel)
            console.log('Server connected to rabbitmq successfully');
        closeConnection(channel, connection);
        return channel;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

const closeConnection = (channel, connection) => {
    process.once('SIGINT', async () => {
        await channel.close();
        await connection.close();
    });
}

module.exports = {
    createConnection,
    closeConnection
}