const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const uploadController = require('../controllers/upload.controller');
const asyncHandler = require('../helpers/async.handler');
const { uploadMemory } = require('../helpers/multer');

class UploadRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.use(asyncHandler(protect));
        
        this.router.post('/user/:userId', 
            uploadMemory.single('profilePicture'), 
            asyncHandler(uploadController.uploadUserImage));

        this.router.post('/tour/:tourId',
            uploadMemory.fields([
                { name: 'thumbnail', maxCount: 1 },
                { name: 'images', maxCount: 20 }
            ]),
            asyncHandler(uploadController.uploadTourImages));

        this.router.post('/image/:folder',
            uploadMemory.single('image'),
            asyncHandler(uploadController.uploadImage));
        return this.router;
    }
}

module.exports = new UploadRoutes();