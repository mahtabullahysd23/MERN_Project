const Order = require("../model/OrderClass");
const Cart = require("../model/CartClass");
const Product = require("../model/ProductClass");
const { success, failure } = require('../utility/common');

class OrderController {
    async create(req, res) {
        try {
            let cartproducts = [];
            let error = [];
            const { cart_id } = req.body;
            const cart = await Cart.findById(cart_id);
            if (!cart) {
                error.push({ msg: "Cart does not exist" });
            }
            else {
                const productPromises = cart.products.map(async (product) => {
                    const extProductstock = await Product.findById(product.product);
                    if (extProductstock.stock < product.quantity) {
                      return { msg: `Product ${extProductstock.name} stock is less than quantity` };
                    }
                    return null;
                  });
                error = await Promise.all(productPromises);
            }
            if (error.length > 0) {
                return res.status(400).send(failure("Validation Error", error));
            }
            cart.products.forEach(product => {
                cartproducts.push({
                    id: product.product,
                    quantity: product.quantity
                })
            })
            const order = {
                user: cart.user,
                cart: cart,
                products: cartproducts,
                total: cart.total
            }
            const created = (await Order.create(order));
            const resData = created.toObject();
            delete resData.cart;
            if (created) {
                await Cart.deleteOne({ _id: cart_id });
                cart.products.forEach(async product => {
                    await Product.updateOne({ _id: product.product }, { $inc: { stock: -product.quantity } });
                });
                return res.status(200).send(success("successfully Received order", resData));
            }
            return res.status(404).send(failure("Order not created"));
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }

    async getAllOrders(req, res) {

        try {
            const orders = await Order.find({}).populate('products.id', '-stock -id').populate('user', '-username -password');
            orders.forEach(order => {
                order.total = (calculatePrice(order));
            })
            if (orders) {
                return res.status(200).send(success("successfully Received orders", orders));
            }
            return res.status(404).send(failure("Order not found"));
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }

    }
}
module.exports = new OrderController();
