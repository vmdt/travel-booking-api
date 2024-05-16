const { acquireLock, releaseLock } = require("../redis/redis.locking");
const { BadRequestError } = require("../utils/error.response");
const CheckoutService = require("./checkout.service");
const BookingModel = require('../models/booking.model');
const TourAvailabilitiesModel = require('../models/tourAvailabilities.model');
const { createBooking, aggregateItems, deleteBooking } = require("../repositories/booking.repo");
const { delayOrderJob } = require("../queues/order.producer");
const { getAll, getMany } = require("../repositories/factory.repo");
const BookingItemsModel = require("../models/bookingItems.model");
const { deleteCartItems, checkTourExist } = require("../repositories/cart.repo");
const { result } = require("lodash");
const CartService = require("./cart.service");
const { Types } = require("mongoose");

const DELAY_ORDER_TIME = 5; //minutes

class BookingService {
    static createBooking = async ({ cartId, userId, discount, personalInfo, tourIds }) => {
        const { checkoutReview, checkoutOrder } = await CheckoutService.checkoutReview({ cartId, discount, tourIds });
        if (checkoutReview.length < 1)
            throw new BadRequestError('Tour items does not exist');
        let keyLocks = [];
        try {
            for (let i=0; i< checkoutReview.length; i++) {
                const { participants, tour, startDate, startTime } = checkoutReview[i];
                const totalQuantity = participants.reduce((acc, participant) => {
                    return acc + participant.quantity;
                }, 0);

                const lockResult = await acquireLock({
                    tourId: tour._id,
                    startDate,
                    quantity: totalQuantity,
                    userId: userId.toString()
                });
                keyLocks.push(lockResult ? lockResult : null);
                if (lockResult) 
                    await releaseLock(lockResult.key);
            }
        
            if (keyLocks.includes(null)) {
                keyLocks.forEach( async lockResult => {
                    if (lockResult)
                        await TourAvailabilitiesModel.findByIdAndUpdate(lockResult.avaiId, {
                            $inc: { vacancies: lockResult.quantity }
                        });
                })
                throw new BadRequestError('Some of your added tours have been updated. Please try again');
            }

            const booking = await createBooking({
                userId,
                discountCode: discount,
                tourItems: checkoutReview,
                checkoutOrder,
                personalInfo
            });
            await deleteCartItems(cartId, tourIds);
            delayOrderJob(booking._id, keyLocks, 1000*60*DELAY_ORDER_TIME);
            return { booking };
        } catch (error) {
            throw error;
        }
    }

    static bookNow = async ({ user, tour }) => {
        let cartId;
        let itemExisting = (await checkTourExist(user, tour.tour, tour.startDate))[0];
        if (!itemExisting) {
            const addedCart = await CartService.addToCart({
                user, tour
            });
            if (!addedCart)
                throw new BadRequestError('Book now error, please try again');
            cartId = addedCart.cart._id;
        } else {
            cartId = itemExisting._id;
        }
        
        return {
            cart: cartId,
            tours: [{
                tour: tour.tour,
                startDate: tour.startDate
            }]
        }
        
    }

    static getListBookings = async (query) => {
        const popOptions = {
            path: 'user',
            select: 'username email',
        };
        const { total, docs: bookings} = await getAll(BookingModel, query, true, popOptions);
        return {
            total,
            result: bookings.length,
            bookings
        }
    }

    static getListBookingsByUser = async (userId, query) => {
        const popOptions = {
            path: 'user',
            select: 'username email',
        };
        const {total, docs: bookings } = await getMany(BookingModel, {
            user: new Types.ObjectId(userId)
        }, query, true, popOptions);
        return {
            total,
            result: bookings.length,
            bookings
        }
    }

    static getBookingDetails = async (bookingId) => {
        const booking = await aggregateItems(bookingId);
        if (!booking[0])
            throw new BadRequestError('Not found booking');
        return booking[0];
    }

    static deleteBooking = async (bookingId) => {
        const result = await deleteBooking(bookingId);
        if (!result)
            throw new BadRequestError('Not found booking or booking has been completed');
        return null;
    }
}

module.exports = BookingService;