const { Types } = require('mongoose');
const CartModel = require('../models/cart.model');
const HotelModel = require('../models/hotel.model');
const TourModel = require('../models/tour.model');
const { BadRequestError, NotFoundError } = require('../utils/error.response');
const { checkTourExist } = require('../repositories/cart.repo');

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

        const itemExisting = await checkTourExist(user, tour.tour, tour.startDate)
        if (itemExisting.length > 0)
            throw new BadRequestError('Tour item already exist');
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

        if (tour.startDate && tour.startDate < new Date().setHours(0, 0, 0, 0))
            throw new BadRequestError('Invalid starting date');
        
        let cart = await CartModel.findOne(query);
        
        // console.log(cart.tours['_id'])

        // if (!cart)
        //     throw new NotFoundError('Not found tour item');
        // Object.keys(restTour).forEach(async key => {
        //     cart = await CartModel.findOneAndUpdate(query, {
        //         $set: {
        //             [`tours.$.${key}`]: restTour[key]
        //         }
        //     });
        // });
        let update = {};
        for (const key in restTour) {
            if (Object.hasOwnProperty.call(restTour, key)) {
              update[`tours.$.${key}`] = restTour[key];
            }
        }

        const updatedCart = await CartModel.findOneAndUpdate(query, update, { new: true });

        // await cart.save();

        // if (tour.startDate < new Date().setHours(0, 0, 0, 0))
        //     throw new BadRequestError('Invalid starting date');
        // const cart = await CartModel.findOneAndUpdate(query, {
        //     'tours.$': restTour
        // }, { new: true });

        // if (!cart)
        //     throw new NotFoundError('Not found tour item');

        return { updatedCart }
    }

    static deleteCartItem = async ({ cartId, itemId }) => {
        const query = { _id: new Types.ObjectId(cartId), status: 'active' },
        updateSet = { $pull: { tours: { _id: itemId } } };

        const cart = await CartModel.findOneAndUpdate(query, updateSet);
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

        cart = await cart.populate([{
            path: "tours.tour",
            select: "title code thumbnail"
        }, { path: "tours.transports" }, { path: "tours.hotels" }]);
        
        return { cart }
    }
}

module.exports = CartService;
