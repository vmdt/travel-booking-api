const VirtualTourService = require("../services/virtualTour.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response");

class VirtualTourController {
    processVirtualTour = async (req, res, next) => {
        const { files } = req;
        const images = req.body.images;
        const { tourId, page } = req.params;

        new SuccessResponse({
            message: 'Process virtual tour successfully',
            metadata: await VirtualTourService.processVirtualImage(tourId, page, images, files.files)
        }).send(res);
    }

    getVirtualTourPage = async (req, res, next) => {
        const { tourId, page } = req.params;

        new SuccessResponse({
            message: 'Get virtual tour page successfully',
            metadata: await VirtualTourService.getVirtualTourPage(tourId, page)
        }).send(res);
    }
}

module.exports = new VirtualTourController();