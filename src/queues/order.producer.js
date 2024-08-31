const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const config = require('../config');

const connection = new IORedis(`${config.REDIS_URL}`, {
    maxRetriesPerRequest: null
});

const orderQueue = new Queue('orderDelay', { connection });

const delayOrderJob = async (bookingId, avaiItems, delay) => {
    await orderQueue.add('order', { bookingId, avaiItems }, { delay });
}

module.exports = {
    delayOrderJob
}