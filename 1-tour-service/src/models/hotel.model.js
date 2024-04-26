const mongoose = require('mongoose');

const Hotel = new mongoose.Schema({
    name: { type: String, required: true },
    thumbnail: String,
    address: String,
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    coordinates: [Number],
    priceOptions: [{
        title: String,
        value: Number,
        currency: { type: String, default: 'VND' }
    }]
});

Hotel.index({ name: 'text' });

module.exports = mongoose.model('Hotel', Hotel);