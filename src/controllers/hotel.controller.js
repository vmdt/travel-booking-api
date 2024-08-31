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

    updateHotel = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update hotel successfully',
            metadata: await HotelService.updateHotel(req.params.hotelId, req.body)
        }).send(res);
    }

    deleteHotel = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete hotel successfully',
            metadata: await HotelService.deleteHotel(req.params.hotelId)
        }).send(res);
    }

    searchHotel = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search hotel successfully',
            metadata: await HotelService.searchHotel({
                keyword: req.params.keyword,
                query: req.query
            })
        }).send(res);
    }
}

module.exports = new HotelController();