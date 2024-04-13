const { Types } = require('mongoose');
const CartModel = require('../models/cart.model');

const getTotalPrice = (tours) => {
    const results = tours.map( el => {
        const totalPrice = el.participants.reduce((acc, participant) => {
            return acc + participant.price * participant.quantity;
        }, 0);
        return { ...el, totalPrice }
    });
    return results;
}

const checkTourExist = async (userId , tourId, startDate) => {
    const result = await CartModel.find({
        user: new Types.ObjectId(userId),
        tours: { $elemMatch: { tour: new Types.ObjectId(tourId), startDate: new Date(startDate) } }
    });
    return result;
}


const deleteCartItems = async (cartId, tourIds) => {
    let cart;
    if (!tourIds)
        cart = await CartModel.findByIdAndUpdate(cartId, {
            tours: []
        });
    else 
        tourIds.forEach(async item => {
            cart = await CartModel.findByIdAndUpdate(cartId, {
                $pull: {
                    tours: {
                        tour: new Types.ObjectId(item.tour),
                        startDate: new Date(item.startDate)
                    }
                }
            });
        })
    return cart;
}

const rollbackCartItems = async (cartId, tourItems) => {
    const cart = await CartModel.findByIdAndUpdate(cartId, {
        $push: { tours: { $each: tourItems }}
    });
    return cart;
}

module.exports = {
    getTotalPrice,
    deleteCartItems,
    rollbackCartItems,
    checkTourExist
}