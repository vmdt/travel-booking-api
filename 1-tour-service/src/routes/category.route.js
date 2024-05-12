const express = require('express');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const asyncHandler = require('../helpers/async.handler');
const categoryController = require('../controllers/category.controller');

class CategoryRoutes {
    constructor() {
        this.router = express.Router();
    }

    routes() {
        this.router.get('/:cateId', asyncHandler(categoryController.getCategoryById));

        this.router.route('/:cateId')
                    .post(protect, restrictTo('admin'), asyncHandler(categoryController.updateCategory))
                    .delete(protect, restrictTo('admin'), asyncHandler(categoryController.deleteCategory))
        this.router.route('/')
                    .post(protect, restrictTo('admin'), asyncHandler(categoryController.createCategory))
                    .get(asyncHandler(categoryController.getAllCategories))
        return this.router;
    }
}

module.exports = new CategoryRoutes();