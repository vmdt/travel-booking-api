const { now } = require("lodash");
const UploadService = require("./upload.service");
const { default: axios } = require("axios");
const config = require("../config");
const { BadRequestError } = require("../utils/error.response");


class VirtualTourService {
    static processVirtualImage = async (tourCode, pageIndex, images = [], files = []) => {
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

        const response = await axios.post(
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

        return response.data;
    }
}

module.exports = VirtualTourService;