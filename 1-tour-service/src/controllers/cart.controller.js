const { addToCartSchema, updateCartSchema, deleteItemSchema } = require("../schemes/cart");
const CartService = require("../services/cart.service");
const { BadRequestError } = require('../utils/error.response');
const { SuccessResponse } = require('../utils/sucess.response');

class CartController {
    addToCart = async (req, res, next) => {
        const { error } = await Promise.resolve(addToCartSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        new SuccessResponse({
            message: 'Add to cart successfully',
            metadata: await CartService.addToCart(req.body)
        }).send(res);
    }

    updateCart = async (req, res, next) => {
        const { error } = await Promise.resolve(updateCartSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        new SuccessResponse({
            message: 'Update cart successfully',
            metadata: await CartService.updateCart(req.body)
        }).send(res);
    }

    deleteCartItem = async (req, res, next) => {
        const { error } = await Promise.resolve(deleteItemSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        new SuccessResponse({
            message: 'Delete cart item successfully',
            metadata: await CartService.deleteCartItem({
                cartId: req.body.cart,
                itemId: req.body.itemId
            })
        }).send(res);
    }

    getListCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list cart successfully',
            metadata: await CartService.getListCart(req.user._id)
        }).send(res);
    }
}

module.exports = new CartController();