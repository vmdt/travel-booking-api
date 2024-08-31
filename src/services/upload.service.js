const { upload } = require("../helpers/cloudinary");
const { NotFoundError } = require("../utils/error.response");

class UploadService {
    static uploadTourImages = async (files, code) => {
        let dataURI, b64, response = {};
        
        if (!files.thumbnail && !files.images)
        throw new NotFoundError('Not found image data');

        if (files.thumbnail) {
            b64 = Buffer.from(files.thumbnail[0].buffer).toString('base64');
            dataURI = "data:" + files.thumbnail[0].mimetype + ";base64," + b64;
            const thumbResult = await upload(dataURI, {
                folder: 'travelife/tour',
                overwrite: true,
                invalidate: true,
                ...(code && { public_id: code })
            });
            response.thumbnailURL = thumbResult.secure_url;
        } 
        
        if (files.images) {
            response.imagesURL = await Promise.all(files.images.map(async (file, i) => {
                b64 = Buffer.from(file.buffer).toString('base64');
                dataURI = "data:" + file.mimetype + ";base64," + b64;
                const imgResult = await upload(dataURI, {
                    folder: 'travelife/tour',
                    overwrite: true,
                    invalidate: true,
                    ...(code && { public_id: `${code}-${i}` })
                });
                return imgResult.secure_url;
            }));
        }
        return response;
    }

    static uploadUserImage = async (file, userId) => {
        let dataURI;
        if (file && file.buffer) {
            const b64 = Buffer.from(file.buffer).toString('base64');
            dataURI = "data:" + file.mimetype + ";base64," + b64;
        } else if (req.body.profilePicture) {
            dataURI = req.body.profilePicture;
        } else {
            throw new NotFoundError('Not found image data');
        }

        const uploadResult = await upload(dataURI, {
            public_id: `${userId}`,
            folder: 'travelife/user',
            overwrite: true,
            invalidate: true
        });

        return { profilePictureURL: uploadResult.secure_url }
    }

    static uploadImage = async (file, folder) => {
        let dataURI;
        if (file && file.buffer) {
            const b64 = Buffer.from(file.buffer).toString('base64');
            dataURI = "data:" + file.mimetype + ";base64," + b64;
        } else {
            throw new NotFoundError('Not found image data');
        }

        const uploadResult = await upload(dataURI, {
            folder: `travelife/${folder}`,
            overwrite: true,
            invalidate: true,
        });

        return {
            imageURL: uploadResult.secure_url
        }
    }
}

module.exports = UploadService;