const { createOne, getAll, getOne } = require("../repositories/factory.repo");
const CategoryModel = require('../models/category.model');
const { Types } = require("mongoose");
const { BadRequestError } = require("../utils/error.response");

class CategoryService {
    static createCategory = async ({
        name, image, icon, isActive = true
    }) => {
        const category = await createOne(CategoryModel, {
            name,
            image,
            icon,
            isActive
        });
        return {
            category: category.toObject()
        }
    }

    static getAllCategories = async (query) => {
        const categories = await getAll(CategoryModel, query);
        return {
            result: categories.length,
            categories
        }
    }

    static getCategoryById = async (cateId) => {
        const category = await getOne(CategoryModel, {
            _id: new Types.ObjectId(cateId)
        });
        if (!category && !category.isActive)
            throw new BadRequestError('Not found category');

        return {
            category: category.toObject()
        }
    }
}

module.exports = CategoryService;