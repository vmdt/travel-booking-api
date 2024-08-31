const mongoose = require('mongoose');

const Transportation = new mongoose.Schema({
    name: { type: String, required: true },
    image: String,
    capacity: { type: Number, required: true },
    brand: String,
    isActive: Boolean,
});

Transportation.index({ name: 'text' });

module.exports = mongoose.model('Transportation', Transportation);