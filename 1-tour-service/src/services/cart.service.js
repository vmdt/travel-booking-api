const { Types } = require('mongoose');
const CartModel = require('../models/cart.model');
const TourModel = require('../models/tour.model');
const { BadRequestError, NotFoundError } = require('../utils/error.response');

class CartService {
    static addToCart = async ({ user, tour }) => {
        const query = { user: new Types.ObjectId(user), status: 'active' },
        updateOrInsert = {
            $addToSet: {
                tours: tour
            }
        }, options = { upsert: true, new: true };
        if (new Date(tour.startDate) < new Date().setHours(0, 0, 0, 0))
            throw new BadRequestError('Invalid starting date');
        const cart = await CartModel.findOneAndUpdate(query, updateOrInsert, options);

        return { cart: cart.toObject() }
    }

    static updateCart = async ({ user, tour }) => {
        const { itemId, ...restTour } = tour;
        const query = { 
            user: new Types.ObjectId(user),
            'tours._id': itemId,
            status: 'active' 
        };
        if (tour.startDate < new Date().setHours(0, 0, 0, 0))
            throw new BadRequestError('Invalid starting date');
        const cart = await CartModel.findOneAndUpdate(query, {
            'tours.$': restTour
        }, { new: true });

        if (!cart)
            throw new NotFoundError('Not found tour item');

        return { cart }
    }

    static deleteCartItem = async ({ userId, itemId }) => {
        const query = { user: userId, status: 'active' },
        updateSet = { $pull: { tours: { _id: itemId } } };

        const cart = await CartModel.findOneAndUpdate(query, updateSet, { new: true });
        return { cart }
    }

    static getListCart = async (userId) => {
        let cart;
        cart = await CartModel.findOneAndUpdate({
            user: userId, status: 'active'
        }, { $pull: { tours: {startDate: {$lt: new Date().setHours(0, 0, 0, 0)}} } }, { new: true });

        if (!cart)
            cart = await CartModel.create({
                user: userId
            });
        
        return { cart }
    }
}

module.exports = CartService;
