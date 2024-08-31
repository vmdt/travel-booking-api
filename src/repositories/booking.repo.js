const crypto = require('crypto');
const { Types } = require('mongoose');
const BookingModel = require('../models/booking.model');
const BookingItemsModel = require('../models/bookingItems.model');
const TourAvailabilitiesModel = require('../models/tourAvailabilities.model');

const createBooking = async ({ userId, discountCode, personalInfo, tourItems, checkoutOrder }) => {
    const booking = await BookingModel.create({
        user: userId,
        discount: discountCode,
        status: 'pending',
        checkoutOrder,
        personalInfo
    });
    let bookingItems = tourItems.map(async item => {
        const randomBytes = await Promise.resolve(crypto.randomBytes(3));
        const randomCharacters = randomBytes.toString('hex');
        let bookingItem = await BookingItemsModel.create({
            booking: booking._id,
            tour: item.tour,
            startDate: item.startDate,
            startTime: item.startTime,
            participants: item.participants,
            ticketCode: randomCharacters,
            isPrivate: item.isPrivate,
            transports: item.transports,
            hotels: item.hotels
        });
        bookingItem = await bookingItem.populate({
            path: 'tour',
            select: 'title code numOfRating ratingAverage thumbnail'
        });
        return bookingItem;
    });
    bookingItems = await Promise.all(bookingItems);
    return {
        ...(booking.toObject()),
        bookingItems
    }
}

const deleteBooking = async (bookingId) => {    
    const booking = await aggregateItems(bookingId);
    if (booking[0] && booking[0].status === 'pending') {
        const { bookingItems } = booking[0];
        // rollback avai_tour vancancies
        bookingItems.forEach(async item => {
            const { participants } = item;
            const quantity = participants.reduce((acc, participant) => {
                return acc + participant.quantity;
            }, 0);
            await TourAvailabilitiesModel.findOneAndUpdate({
                startDate: item.startDate,
                tour: item.tour
            }, { $inc: { vacancies: quantity }});
        });
        // delete booking
        await BookingItemsModel.deleteMany({ booking: new Types.ObjectId(bookingId) });
        await BookingModel.findByIdAndDelete(bookingId);
        return true;
    }
    return false;
}

const aggregateItems = async (bookingId) => {
    return await BookingModel.aggregate([
        { $match: { _id: new Types.ObjectId(bookingId) } },
        {
            $lookup: {
                from: 'booking_items',
                localField: '_id',
                foreignField: 'booking',
                as: 'bookingItems'
            }
        }
    ])
}

module.exports = {
    createBooking,
    aggregateItems,
    deleteBooking
}