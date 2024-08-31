const { createClient } = require('redis');
const config = require('../config');

const client = createClient({ url: `${config.REDIS_URL}` });

const redisConnect = async () => {
    try {
        client
        .on('error', err => console.log('Redis Client Error', err))
        .connect()
        console.log(`Connect to Redis: ${await client.ping()}`);
        return client;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

module.exports = {
    redisConnect,
    client
}