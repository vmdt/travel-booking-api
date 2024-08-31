const multer = require('multer');
const { BadRequestError } = require('../utils/error.response');

const filterImage = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new BadRequestError('Not an image! Please upload only images.'), false);
    }
}

const uploadDisk = (folder) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `./src/uploads/${folder}`)
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
            }
        }),
        fileFilter: filterImage
    })
}

const uploadMemory = multer({
    storage: multer.memoryStorage(),
    fileFilter: filterImage
})

module.exports = {
    uploadDisk,
    uploadMemory
}