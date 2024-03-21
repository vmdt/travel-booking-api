const LocationModel = require('../models/location.model');
const TourModel = require('../models/tour.model');

class SearchService {
    static search = async (keyword) => {
        let suggestions = [];
        suggestions = await LocationModel.find({
            title: { $regex: `^${keyword}`, $options: 'iu' }
        }).lean();

        if (suggestions.length <= 1) {
            const regexSearch = new RegExp(`^${keyword}`, 'iu');
            const foundTours = await TourModel.find({
                isActive: true,
                $text: { $search: regexSearch }
            }, { score: { $meta: 'textScore' }})
            .sort({ score: { $meta: 'textScore' }})
            .select('title thumbnail type startLocation').lean();

            suggestions.push(...foundTours);
        }

        return {
            result: suggestions.length,
            suggestions
        }
    }
}

module.exports = SearchService;