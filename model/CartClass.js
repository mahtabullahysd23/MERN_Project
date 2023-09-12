const mongoose = require('mongoose');
const { TimeSeriesBucketTimestamp } = require('redis');
const CartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
            unique: true    
        },
        products: {
            type: [
                {
                    product: {
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
            required: true
        }
    },
    {
        timestamps: true
    }
);
const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;


    