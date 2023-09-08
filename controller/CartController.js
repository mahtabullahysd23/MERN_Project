const Cart = require('../model/CartClass');
const Product = require('../model/ProductClass');
const { success, failure } = require('../utility/common');
const { validationResult } = require("express-validator");
const User = require('../model/UserClass');

class CartController {
    async add(req, res) {
        try {
            let error = [];
            let totalprev = 0;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(failure("Validation Error", errors.array()));
            }
            const cart = req.body;
            const extUser = await User.findById({ _id: cart.user });
            const extProduct = await Product.findById({ _id: cart.product });
            const extCartandProduct = await Cart.findOne({ user: cart.user, "products.product": cart.product }).select({ "products.$": 1 });
            const extCart = await Cart.findOne({ user: cart.user });
            if (!extUser) {
                error.push({ msg: "User does not exist" });
            }
            if (!extProduct) {
                error.push({ msg: "Product does not exist" });
            }
            if (extProduct) {
                if (extProduct.stock < cart.quantity) {
                    error.push({ msg: "Product stock is less than quantity" });
                }
                else if (extProduct.stock == 0) {
                    error.push({ msg: "Product stock is zero" });
                }
                else if (extCartandProduct && extProduct.stock < extCartandProduct.products[0].quantity + cart.quantity) {
                    error.push({ msg: "Product stock is less than quantity" });
                }
            }
            if (error.length > 0) {
                return res.status(400).send(failure("Validation Error", error));
            }
            if (extCart) {
                totalprev = extCart.total;
            }
            const cartitem = {
                user: cart.user,
                products:
                {
                    product: cart.product,
                    quantity: cart.quantity
                },
                total: (totalprev + (cart.quantity * extProduct.price))
            }
            if (extCart) {
                if (await Cart.findOne({ user: cart.user, "products.product": cart.product })) {
                    const updated = await Cart.updateOne({ user: cart.user, "products.product": cart.product }, { $inc: { "products.$.quantity": cart.quantity } });
                    const updatedtotal = await Cart.updateOne({ user: cart.user }, { $set: { total: cartitem.total } });
                    if (updated && updatedtotal) {
                        const mycart = await Cart.findOne({ user: cart.user });
                        return res.status(200).send(success("successfully Added to cart", mycart));
                    }
                    return res.status(404).send(failure("Cart not updated"));
                }
                else {
                    const updated = await Cart.updateOne({ user: cart.user }, { $push: { products: cartitem.products } });
                    const updatedtotal = await Cart.updateOne({ user: cart.user }, { $set: { total: cartitem.total } });
                    if (updated && updatedtotal) {
                        const mycart = await Cart.findOne({ user: cart.user });
                        return res.status(200).send(success("successfully Added to cart", mycart));
                    }
                    return res.status(404).send(failure("Cart not updated"));
                }
            }
            else {
                const created = await Cart.create(cartitem);
                if (created) {
                    return res.status(200).send(success("successfully Added to cart", created));
                }
                return res.status(404).send(failure("Cart not created"));
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error"));
        }
    }

    async remove(req, res) {
        try {
            let error = [];
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(failure("Validation Error", errors.array()));
            }
            const cart = req.body;
            const extUser = await User.findById({ _id: cart.user });
            const extcart = await Cart.findOne({ user: cart.user });
            if (!extUser) {
                error.push({ msg: "User does not exist" });
            }
            if (!extcart) {
                error.push({ msg: "You have no product in the cart" });
            }

            if (extcart) {
                const extProduct = await Cart.findOne({ user: cart.user, "products.product": cart.product }).select({ "products.$": 1 });
                if (!extProduct) {
                    error.push({ msg: "Product does not exist in the cart" });
                }
                if (extProduct) {
                    if (extProduct.products[0].quantity < cart.quantity) {
                        error.push({ msg: "Quantity is greater than the quantity in the cart" });
                    }
                }
            }
            if (error.length > 0) {
                return res.status(400).send(failure("Validation Error", error));
            }
            const updated = await Cart.updateOne({ user: cart.user, "products.product": cart.product }, { $inc: { "products.$.quantity": -cart.quantity } });
            const extProduct = await Product.findById({ _id: cart.product });
            const total = extcart.total - (cart.quantity * extProduct.price);
            const updatedtotal = await Cart.updateOne({ user: cart.user }, { $set: { total: total } });
            if (updated && updatedtotal) {
                const mycart = await Cart.findOne({ user: cart.user });
                mycart.products.forEach(product => {
                    if(product.quantity==0){
                        mycart.products.remove(product);
                    }
                });
                 await Cart.updateOne({ user: cart.user }, { $set: {products: mycart.products} });
                 if(mycart.products.length==0){
                    await Cart.deleteOne({ user: cart.user });
                    return res.status(200).send(success("successfully Removed from cart", {msg:"Cart is empty"}));
                 }
                return res.status(200).send(success("successfully Removed from cart", mycart));
            }
        }
        catch (e) {
            return res.status(500).send(failure("Internal Server Error"));
        }

    }

}

module.exports = new CartController();