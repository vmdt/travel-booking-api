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

const deleteCartItems = async (cartId, tourIds) => {
    let cart;
    if (!tourIds)
        cart = await CartModel.findByIdAndUpdate(cartId, {
            tours: []
        });
    else 
        cart = await CartModel.findByIdAndUpdate(cartId, {
            $pull: { tours: { tour: { $in: [...tourIds] }}}
        });
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
    rollbackCartItems
}