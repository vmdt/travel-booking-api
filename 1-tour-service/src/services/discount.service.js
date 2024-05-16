const _ = require('lodash');
const { Types } = require('mongoose');
const DiscountModel = require('../models/discount.model');
const TourModel = require('../models/tour.model');
const { getOne, createOne, getAll, getMany, updateOne } = require('../repositories/factory.repo');
const { BadRequestError, NotFoundError } = require('../utils/error.response');

class DiscountService {
    static createDiscount = async (payload) => {
        const { 
            name, code, value, type,
            startDate, endDate, minOrder,
            isActive, tours, appliesTo
        } = payload;
        const discountExisting = await DiscountModel.findOne({ code }).lean();

        if (discountExisting)
            throw new BadRequestError('Discount already exists');

        const discount = await createOne(DiscountModel, {
            name, code, value, type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            minOrder, isActive, appliesTo,
            tours: appliesTo === 'total_order' ? [] : tours
        });

        return { discount }
    }

    static searchDiscount = async (code) => {
        const foundDiscounts = await DiscountModel.find({
            isActive: true,
            code: { $regex:`^${code}`, $options: 'iu' }
        }).lean();

        return {
            result: foundDiscounts.length,
            discounts: foundDiscounts
        }
    }

    static getAllDiscounts = async (query) => {
        const {total, docs: discounts} = await getAll(DiscountModel, query);
        return {
            total,
            result: discounts.length,
            discounts
        }
    }

    static getActiveDiscounts = async (query) => {
        const {total, docs: discounts} = await getMany(DiscountModel, {
            isActive: true
        }, query);

        return {
            total,
            result: discounts.length,
            discounts
        }
    }

    static getInactiveDiscounts = async (query) => {
        const {total, docs: discounts} = await getMany(DiscountModel, {
            isActive: true
        }, query);

        return {
            total,
            result: discounts.length,
            discounts
        }
    }

    static activateDiscount = async (discountId) => {
        const discount = await updateOne(DiscountModel, {
            _id: new Types.ObjectId(discountId)
        }, { isActive: true });
        if (!discount)
            throw new NotFoundError('Not found discount');
        return {
            discount: discount.toObject()
        }
    }

    static deactivateDiscount = async (discountId) => {
        const discount = await updateOne(DiscountModel, {
            _id: new Types.ObjectId(discountId)
        }, { isActive: false });
        if (!discount)
            throw new NotFoundError('Not found discount');
        return {
            discount: discount.toObject()
        }
    }

    static getDiscountById = async (discountId) => {
        const discount = await getOne(DiscountModel, {
            _id: new Types.ObjectId(discountId)
        });
        if (!discount)
            throw new NotFoundError('Not found discount');
        if (!discount.isActive)
            throw new BadRequestError('Discount has been deactivated');

        return discount;
    }

    static updateDiscount = async (discountId, payload) => {
        const discountExisting = await DiscountModel.findById(
            new Types.ObjectId(discountId)
        ).lean();
        if (!discountExisting)
            throw new NotFoundError('Not found discount');
        if (!discountExisting.isActive)
            throw new BadRequestError('Discount has been deactivated');

        const discount = await updateOne(DiscountModel, {
            _id: new Types.ObjectId(discountId)
        }, payload);
        return {
            discount: discount.toObject()
        }
    }

    static getToursByDiscountCode = async (code, query) => {
        const discount = await DiscountModel.findOne({ code }).lean();
        if (!discount)
            throw new NotFoundError('Not found discount');
        if (!discount.isActive)
            throw new BadRequestError('Discount has been deactivated');

        const {total, docs: tours} = await getMany(TourModel, {
            _id: { $in: discount.tours }
        }, query, true);

        return { 
            total,
            result: tours.length,
            tours    
        };
    }

    static getDiscountAmount = async ({ code, tours }) => {
        const discountExisting = await DiscountModel.findOne({ code }).lean();
        if (!discountExisting)
            throw new NotFoundError('Not found discount');
        
        const {
            isActive, startDate, endDate,
            maxUses, usedCount, minOrder,
            type, value, appliesTo
        } = discountExisting;

        if (!isActive)
            throw new BadRequestError('Discount has been deactivated');

        const currentDate = new Date().setHours(0, 0, 0, 0);
        if (endDate < currentDate || currentDate < startDate)
            throw new BadRequestError('Invalid discount');

        if (usedCount >= maxUses)
            throw new BadRequestError('Discount ran out');

        const totalOrder = tours.reduce((acc, tour) => {
            return acc + tour.totalPrice;
        }, 0);
        
        if (totalOrder < minOrder)
            throw new BadRequestError(`Discount require min order of ${minOrder}`);
        let amount = 0, discountTours = [], discountPrice;
        if (appliesTo === 'specific') {
            tours.forEach((tour) => {
                const match = discountExisting.tours.some(el => {
                    return el.toString() === tour.tourId.toString();
                });
                if (match) {
                    discountPrice = type === 'fixed_amount' ? value : tour.totalPrice * (value/100);
                    amount += discountPrice;
                    tour.discountPrice = discountPrice;
                    discountTours.push({ tour });
                }
            })
        } else {
            discountPrice = type === 'fixed_amount' ? value : tour.totalPrice * (value/100);
            amount += discountPrice;
            tour.discountPrice = discountPrice;
            discountTours.push({ tour });
        }

        return {
            itemPrices: discountTours,
            checkoutOrder: {
                totalOrder,
                discount: amount,
                totalPrice: totalOrder - amount
            }
        };
    }
}

module.exports = DiscountService;