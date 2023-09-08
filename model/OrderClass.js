const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    cart:{
        type: Object,
        required: [true, "Cart is required"]
    },
    products: {
        type: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: [true, "Product Id is required"],
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    required: [true, "Quantity is required"]
                },
                _id:false,
            }
        ],
    },
    total: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        default: "Pending"
    }
}, {
    timestamps: true
}
)


const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;