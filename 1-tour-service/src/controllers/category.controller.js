const tourTypeSchema = require("../schemes/tour/tourType");
const CategoryService = require("../services/category.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response");

class CategoryController {
    createCategory = async (req, res, next) => {
        const { error } = await Promise.resolve(tourTypeSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);
        
        new SuccessResponse({
            message: 'Create category successfully',
            metadata: await CategoryService.createCategory(req.body)
        }).send(res);
    }

    getAllCategories = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all categories successfully',
            metadata: await CategoryService.getAllCategories(req.query)
        }).send(res);
    }

    getCategoryById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get category successfully',
            metadata: await CategoryService.getCategoryById(req.params.cateId)
        }).send(res);
    }

    updateCategory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update category successfully',
            metadata: await CategoryService.updateCategory(req.params.cateId, req.body)
        }).send(res);
    }

    deleteCategory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete category successfully',
            metadata: await CategoryService.deleteCategory(req.params.cateId)
        }).send(res);
    }
}

module.exports = new CategoryController();