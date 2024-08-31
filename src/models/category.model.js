const mongoose = require('mongoose');

const Category = new mongoose.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    image: { type: String, required: true },
    icon: { type: String }
});

module.exports = mongoose.model('Category', Category);