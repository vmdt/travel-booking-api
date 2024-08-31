const mongoose = require('mongoose');

const Booking = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    discount: String,
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    checkoutOrder: {
        totalOrder: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        totalPrice: { type: Number, default: 0 }
    },
    personalInfo: { type: mongoose.Schema.Types.Mixed },
    payment: { type: mongoose.Schema.Types.Mixed },
    approveAt: Date
});

module.exports = mongoose.model('Booking', Booking);