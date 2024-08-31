const { Types } = require('mongoose');
const HotelModel = require('../models/hotel.model');
const { createOne, getAll, updateOne, deleteOne, getMany } = require('../repositories/factory.repo');
const { NotFoundError, BadRequestError } = require('../utils/error.response');

class HotelService {
    static createHotel = async (payload) => {
        const hotel = await createOne(HotelModel, payload);
        return { hotel: hotel };
    }

    static getAllHotels = async (query) => {
        const { total, docs: hotels } = await getAll(HotelModel, query);
        return {
            total,
            result: hotels.length,
            hotels
        }
    }

    static updateHotel = async (hotelId, payload) => {
        const hotel = await updateOne(HotelModel, {
            _id: new Types.ObjectId(hotelId)
        }, payload);
        if (!hotel)
            throw new NotFoundError('Not found hotel');

        return {
            hotel
        }
    }

    static deleteHotel = async (hotelId) => {
        const hotel = await deleteOne(HotelModel, hotelId);
        if (!hotel)
            throw new NotFoundError('Not found hotel');

        return null;
    }

    static searchHotel = async ({ keyword, query }) => {
        const {total, docs: foundHotels } = await getMany(HotelModel, {
            name: { $regex: keyword, $options: 'i' }
        }, query);

        return {
            total,
            result: foundHotels.length,
            hotels: foundHotels
        }
    }
}

module.exports = HotelService;