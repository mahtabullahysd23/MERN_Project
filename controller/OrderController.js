const Order = require("../model/OrderClass");
const Product = require("../model/ProductClass");
const { success, failure } = require('../utility/common');
const { validationResult } = require("express-validator");

function calculatePrice(orderData) {
    const totalPrice = orderData.products.reduce((acc, product) => {
        const price = product.id.price;
        const quantity = product.quantity;
        return acc + price * quantity;
    }, 0);
    return totalPrice;
}

class OrderController {
    async create(req, res) {
        try {
            const order = req.body;
            const created = await Order.create(order);
            await Product.updateMany({ _id: { $in: order.products.map(product => product.id) } }, { $inc: { stock: -1 } });
            if (created) {
                return res.status(200).send(success("successfully Received order", created));
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
