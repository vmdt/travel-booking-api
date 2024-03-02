const mongoose = require('mongoose');

const BookingItems = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour'
    },
    startDate: Date,
    endDate: Date,
    startTime: String,
    participants: [{
        title: String,
        quantity: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        currency: { type: String, default: 'VND' }
    }],
    ticketCode: String
}, {
    collection: 'booking_items'
});

module.exports = mongoose.model('BookingItems', BookingItems);