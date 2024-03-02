const mongoose = require('mongoose');

const Transportation = new mongoose.Schema({
    name: { type: String, required: true },
    image: String,
    capacity: { type: Number, required: true },
    brand: String,
    isActive: Boolean,
});

module.exports = mongoose.model('Transportation', Transportation);