const mongoose = require('mongoose');

const Interest = new mongoose.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    image: { type: String, required: true },
    icon: { type: String }
});

module.exports = mongoose.model('Interest', Interest);