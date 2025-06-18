const { now } = require("lodash");
const UploadService = require("./upload.service");
const { default: axios } = require("axios");
const config = require("../config");
const { BadRequestError } = require("../utils/error.response");
const TourModel = require("../models/tour.model");


class VirtualTourService {
    static processVirtualImage = async (tourCode, pageIndex, images = [], files = []) => {
        tourCode = !tourCode ? 'temp' : tourCode;
        pageIndex = !pageIndex ? 'temp' : pageIndex;
        if (files.length > 0) {
            let uploadedImages = [];
            try {
                uploadedImages = await Promise.all(
                    files.map(async (file, index) => {
                    const { imageURL } = await UploadService.uploadImage(
                        file,
                        `travelife/tour/${tourCode}/virtual/${pageIndex}`,
                        `${index}-${now()}`
                    );
                    return imageURL;
                    })
                );
            } catch (err) {
                console.log(err);
                uploadedImages = [];
            }
            images = [...images, ...uploadedImages];
        }
        let response;
        try {
            response = await axios.post(
                `${config.PYTHON_EXPORT_URL}/stitch/preview-image`,
                {
                    'images': images,
                    'folder': 'travelife/tour/' + tourCode + '/virtual/' + pageIndex,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            if (response.status !== 200) {
                throw new BadRequestError('Data does not satisfy for stitching images');
            }
        } catch (err) {
            throw new BadRequestError('Data does not satisfy for stitching images');
        }

        if (!response) {
            throw new BadRequestError('Data does not satisfy for stitching images');
        }

        return {
            'images': images,
            'processedImage': response.data.url,
        };
    }

    static getVirtualTourPage = async (tourId, pageIndex) => {
        const virtualTour = await TourModel.findOne(
            { _id: tourId, "virtualTours.id": pageIndex.toString() },
            { "virtualTours.$": 1 },
        ).lean();

        if (!virtualTour) {
            throw new BadRequestError('Virtual tour not found');
        }
        return virtualTour.virtualTours[0];
    }
}

module.exports = VirtualTourService;