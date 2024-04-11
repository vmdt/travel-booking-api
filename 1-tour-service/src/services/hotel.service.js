const { Types } = require('mongoose');
const HotelModel = require('../models/hotel.model');
const { createOne } = require('../repositories/factory.repo');
const { NotFoundError, BadRequestError } = require('../utils/error.response');

class HotelService {
    static createHotel = async (payload) => {
        const hotel = await createOne(HotelModel, payload);
        return { hotel: hotel };
    }

    static getAllHotels = async (query) => {
        const hotels = await getAll(HotelModel, query);
        return {
            result: hotels.length,
            hotels
        }
    }
}

module.exports = HotelService;