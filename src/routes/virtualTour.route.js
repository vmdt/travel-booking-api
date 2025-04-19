const express = require('express');
const asyncHandler = require('../helpers/async.handler');
const virtualTourController = require('../controllers/virtualTour.controller');
const { uploadMemory } = require('../helpers/multer');

class VirtualTourRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.post('/process/:tourId/:page',
            uploadMemory.fields([
                { name: 'files', maxCount: 5 },
            ]),
            asyncHandler(virtualTourController.processVirtualTour)
        );

        this.router.get('/:tourId/:page',
            asyncHandler(virtualTourController.getVirtualTourPage)
        );

        return this.router;
    }
}

module.exports = new VirtualTourRoutes();