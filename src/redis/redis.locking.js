const { promisify } = require('node:util');
const { client } = require('./redis.connection');
const TourAvailabilitiesService = require('../services/tourAvailabilities.service');

const RETRY_TIMES = 10;
const EXPIRE_TIME = 3000;
const RETRY_WAITING = 50;
const PREFIX_LOCK = 'lock';

const acquireLock = async ({ tourId, startDate, quantity, userId }) => {
    try {
        const key = `${PREFIX_LOCK}_${tourId}_${startDate}`;
        for (let i=0; i<RETRY_TIMES; i++) {
            let result = await client.setNX(key, userId);
            await client.pExpire(key, EXPIRE_TIME);
            if (result) {
                // user is holding the key
                const reservation = 
                    await TourAvailabilitiesService.reservationTour({
                        tourId,
                        startDate,
                        quantity
                    });
                await client.pExpire(key, EXPIRE_TIME); // time to live
                return reservation ? { key, avaiId: reservation._id, quantity } : null;
            } else {
                await Promise.resolve(resolve => setTimeout(resolve, RETRY_WAITING));
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const releaseLock = async (key) => {
    return await client.del(key);
}

module.exports = {
    acquireLock,
    releaseLock
}
