const { getOne } = require('../repositories/factory.repo');
const CheckoutService = require('../services/checkout.service');
const { SuccessResponse } = require('../utils/sucess.response');
const BookingModel = require('../models/booking.model');
const { Types } = require('mongoose');
const { NotFoundError, BadRequestError } = require('../utils/error.response');
const VNPayService = require('../services/vnpay.service');

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        const { cart: cartId, discountCode: discount, tours: tourIds } = req.body;
        new SuccessResponse({
            message: 'Get checkout review successfully',
            metadata: await CheckoutService.checkoutReview({
                cartId, discount, tourIds
            })
        }).send(res);
    }

    payBooking = async (req, res, next) => {
        const { bookingId, paymentMethod } = req.params;
        const bookingExisting = await getOne(BookingModel, {
            _id: new Types.ObjectId(bookingId)
        }, false);

        if (!bookingExisting)
            throw new NotFoundError('Not found booking');
        if (bookingExisting.status === 'completed')
            throw new BadRequestError('Booking has been paid');
        else if (paymentMethod === 'vnpay') {
            const apiURL = `${req.protocol}://${req.get('host')}`;
            const paymentURL = await VNPayService.createPaymentURL({
                ipAddress: req.ipv4,
                apiURL,
                clientURL: req.headers.origin,
                bookingId: bookingExisting._id.toString(),
                bookingAmount: bookingExisting.checkoutOrder.totalPrice
            });
            new SuccessResponse({
                message: 'Create payment url successfully',
                metadata: { paymentURL }
            }).send(res);
        } else {
            throw new BadRequestError('Payment method does not exist');
        }
    }
}

module.exports = new CheckoutController();