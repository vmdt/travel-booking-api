const mongoose = require('mongoose');

const Location = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: 'point', enum: ['point', 'city'] },
    loc: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        }, 
        coordinates: [Number]
    }
});

Location.index({ name: 'text' });

module.exports = mongoose.model('Location', Location);