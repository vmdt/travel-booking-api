const { discountSchema, updateDiscountSchema, getAmountSchema } = require("../schemes/discount");
const DiscountService = require("../services/discount.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response");

class DiscountController {
    getDiscountAmount = async (req, res, next) => {
        const { error } = await Promise.resolve(getAmountSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);
        new SuccessResponse({
            message: 'Get discount amount successfully',
            metadata: await DiscountService.getDiscountAmount(req.body)
        }).send(res);
    }

    getToursByDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get tours successfully',
            metadata: await DiscountService.getToursByDiscountCode(req.params.code, req.query)
        }).send(res);
    }

    createDiscount = async (req, res, next) => {
        const { error } = await Promise.resolve(discountSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        new SuccessResponse({
            message: 'Create discount successfully',
            metadata: await DiscountService.createDiscount(req.body)
        }).send(res);
    }

    getAllDiscounts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all discounts successfully',
            metadata: await DiscountService.getAllDiscounts(req.query)
        }).send(res);
    }

    getActiveDiscounts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get active discounts successfully',
            metadata: await DiscountService.getActiveDiscounts(req.query)
        }).send(res);
    }

    getInactiveDiscounts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get inactive discounts successfully',
            metadata: await DiscountService.getInactiveDiscounts(req.query)
        }).send(res);
    }

    activateDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Activated discount successfully',
            metadata: await DiscountService.activateDiscount(req.params.discountId)
        }).send(res);
    }

    deactivateDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Deactivated discount successfully',
            metadata: await DiscountService.deactivateDiscount(req.params.discountId)
        }).send(res);
    }

    getDiscountById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get discount successfully',
            metadata: await DiscountService.getDiscountById(req.params.discountId)
        }).send(res);
    }

    updateDiscount = async (req, res, next) => {
        const { error } = await Promise.resolve(updateDiscountSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        new SuccessResponse({
            message: 'Update discount successfully',
            metadata: await DiscountService.updateDiscount(req.params.discountId, req.body)
        }).send(res);
    }

    searchDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Searching discount successfully',
            metadata: await DiscountService.searchDiscount(req.params.code)
        }).send(res);
    }
}

module.exports = new DiscountController();