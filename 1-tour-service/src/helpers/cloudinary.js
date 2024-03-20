const cloudinary = require('cloudinary');

const upload =  (file, options = {}) => {
    return new Promise((resolve) => {
        cloudinary.v2.uploader.upload(file, {
            ...options,
            resource_type: 'auto' // zip, images
        }, (error, result) => { error ? resolve(error) : resolve(result) });
    });
}

const videoUpload = (file, options = {}) => {
    return new Promise((resolve) => {
        cloudinary.v2.uploader.upload(file, {
            ...options,
            resource_type: 'video'
        }, (error, result) => { error ? resolve(error) : resolve(result) })
    })
}

module.exports = {
    upload,
    videoUpload
}