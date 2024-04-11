const HotelService = require("../services/hotel.service")
const { SuccessResponse } = require("../utils/sucess.response")

class HotelController {
    createHotel = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create hotel successfully',
            metadata: await HotelService.createHotel(req.body)
        }).send(res);
    }

    getAllHotels = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all hotels successfully',
            metadata: await HotelService.getAllHotels(req.query)
        }).send(res);
    }
}

module.exports = new HotelController();