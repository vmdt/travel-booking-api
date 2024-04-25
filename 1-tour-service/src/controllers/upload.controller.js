const { upload } = require("../helpers/cloudinary");
const { getCodeByTourId } = require("../repositories/tour.repo");
const UploadService = require("../services/upload.service");
const { BadRequestError, NotFoundError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response");

class UploadController {
    uploadUserImage = async (req, res, next) => {
        const { file } = req;

        new SuccessResponse({
            message: 'Upload image successfully',
            metadata: await UploadService.uploadUserImage(file, req.params.userId)
        }).send(res);
    }

    uploadTourImages = async (req, res, next) => {
        let code;
        const { files } = req;

        if (req.params.tourId) {
            code = await getCodeByTourId(req.params.tourId);
        } else {
            code = req.body.code;
        }
        
        new SuccessResponse({
            message: 'Upload images successfully',
            metadata: await UploadService.uploadTourImages(files, code)
        }).send(res);
    }

    uploadImage = async (req, res, next) => {
        const { file } = req;

        new SuccessResponse({
            message: 'Upload image successfully',
            metadata: await UploadService.uploadImage(file, req.params.folder)
        }).send(res);
    }
}

module.exports = new UploadController();