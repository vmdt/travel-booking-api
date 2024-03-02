const mongoose = require('mongoose');

const Cart = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    tourCount: { type: Number, default: 0 },
    tours: [{
        tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
        startDate: Date,
        startTime: String,
        participants: [
            {
                title: String,
                quantity: { type: Number, default: 0 },
                price: { type: Number, default: 0 },
                currency: { type: String, default: 'VND' }
            }
        ]
    }]
});

module.exports = mongoose.model('Cart', Cart);