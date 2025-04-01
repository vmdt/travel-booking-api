const mongoose = require('mongoose');

const BookingItems = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    tour: {
        type: mongoose.Schema.Types.Mixed
    },
    isPrivate: { type: Boolean, default: false },
    startDate: Date,
    endDate: Date,
    startTime: String,
    participants: [{
        title: String,
        quantity: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        currency: { type: String, default: 'VND' }
    }],
    ticketCode: String,
    transports: [{
        type: mongoose.Schema.Types.Mixed
    }],
    hotels: [{
        type: mongoose.Schema.Types.Mixed
    }],
    isShowReview: { type: Boolean, default: false },
}, {
    collection: 'booking_items',
    timestamps: true
});

module.exports = mongoose.model('BookingItems', BookingItems);