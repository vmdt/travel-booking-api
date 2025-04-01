const mongoose = require('mongoose');

const TourAvailabilities = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour'
    },
    startDate: Date,
    endDate: Date,
    startTime: String,
    vacancies: { type: Number, default: 20 }
}, {
    collection: 'tour_availabilities',
    timestamps: true
});

module.exports = mongoose.model('TourAvailabilities', TourAvailabilities);