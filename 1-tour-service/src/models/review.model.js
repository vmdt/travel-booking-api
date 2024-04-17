const mongoose = require('mongoose');

const Review = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour'
    },
    rating: {
        type: Number,
        require: true,
        enum: [1, 2, 3, 4, 5]
    },
    content: String,
    reviewAt: Date,
    isHidden: {
        type: Boolean,
        default: false
    },
    approve: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Review', Review);