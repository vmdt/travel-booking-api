const { Types } = require("mongoose")
const { getOne } = require("../repositories/factory.repo")
const CartModel = require('../models/cart.model');
const { NotFoundError, BadRequestError } = require("../utils/error.response");
const { getTotalPrice } = require("../repositories/cart.repo");
const DiscountService = require("./discount.service");
const BookingModel = require('../models/booking.model');

class CheckoutService {
    static checkoutReview = async ({ cartId, discount, tourIds }) => {
        const cart = await getOne(CartModel, {
            _id: new Types.ObjectId(cartId)
        }, false);
        if (!cart)
            throw new NotFoundError('Not found cart');

        await cart.populate([{
            path: 'tours.tour',
            select: 'title code numOfRating ratingAverage thumbnail',
        }, {
            path: 'tours.transports'
        }]);

        let { tours } = cart;
        tours = tours.toObject();
        if (tourIds)
            tours = tours.filter(item => tourIds.includes(item.tour._id.toString()));
        let checkoutOrder = {
            totalOrder: 0,
            discount: 0,
            totalPrice: 0
        };
        const toursWithTotalPrice = getTotalPrice(tours);

        if (discount) {
            const amountPayload = toursWithTotalPrice.map( item => {
                return { tourId: item.tour._id, totalPrice: item.totalPrice }
            });
            checkoutOrder = await DiscountService.getDiscountAmount({
                code: discount,
                tours: amountPayload
            });
        } else {
            const total = toursWithTotalPrice.reduce( (acc, tour) => {
                return acc + tour.totalPrice;
            }, 0);
            checkoutOrder.totalOrder += total;
            checkoutOrder.totalPrice += total;
        }

        return {
            checkoutReview: tours,
            checkoutOrder
        }
    }

}

module.exports = CheckoutService;