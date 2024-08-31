const { bookingSchema } = require("../schemes/booking");
const BookingService = require("../services/booking.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response");

class BookingController {
    createBooking = async (req, res, next) => {
        const { error } = await Promise.resolve(bookingSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);
        const { cart: cartId, discountCode: discount, personalInfo, tours: tourIds } = req.body;
        new SuccessResponse({
            message: 'Create booking successfully',
            metadata: await BookingService.createBooking({
                cartId, 
                userId: req.user._id, 
                discount,
                personalInfo,
                tourIds
            })
        }).send(res);
    }

    bookNow = async (req, res, next) => {
        new SuccessResponse({
            message: 'Book now successfully',
            metadata: await BookingService.bookNow(req.body)
        }).send(res);
    }
    
    getListBookings = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list bookings successfully',
            metadata: await BookingService.getListBookings(req.query)
        }).send(res);
    }

    getBookingDetails = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get booking details successfully',
            metadata: await BookingService.getBookingDetails(req.params.bookingId)
        }).send(res);
    }

    deleteBooking = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete booking successfully',
            metadata: await BookingService.deleteBooking(req.params.bookingId)
        }).send(res);
    }

    getListBookingsByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list bookings successfully',
            metadata: await BookingService.getListBookingsByUser(req.user._id, req.query)
        }).send(res);
    }
}

module.exports = new BookingController();