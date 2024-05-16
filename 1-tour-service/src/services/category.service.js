const { createOne, getAll, getOne, updateOne, deleteOne } = require("../repositories/factory.repo");
const CategoryModel = require('../models/category.model');
const { Types } = require("mongoose");
const { BadRequestError, NotFoundError } = require("../utils/error.response");

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
        const {total, docs: categories } = await getAll(CategoryModel, query);
        return {
            total,
            result: categories.length,
            categories
        }
    }

    static getCategoryById = async (cateId) => {
        const category = await getOne(CategoryModel, {
            _id: new Types.ObjectId(cateId)
        }, false);
        if (!category && !category.isActive)
            throw new BadRequestError('Not found category');

        return {
            category: category
        }
    }

    static updateCategory = async (cateId, payload) => {
        const category = await updateOne(CategoryModel, {
            _id: new Types.ObjectId(cateId)
        }, payload);

        if (!category)
            throw new NotFoundError('Not found category');

        return {
            category
        }
    }

    static deleteCategory = async (cateId) => {
        const category = await deleteOne(CategoryModel, cateId);

        if (!category)
            throw new NotFoundError('Not found category');

        return null;
    }
}

module.exports = CategoryService;