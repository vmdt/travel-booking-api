const mongoose = require('mongoose');

const Location = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, default: 'point', enum: ['point', 'city'] },
    loc: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        }, 
        coordinates: [Number]
    },
    thumbnail: String
});

Location.index({ name: 'text' });

module.exports = mongoose.model('Location', Location);