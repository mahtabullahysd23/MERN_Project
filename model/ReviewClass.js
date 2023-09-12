const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"]
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"]
    },
    review: {
        type: String,
        required: [true, "Review is required"]
    }
}, {
    timestamps: true
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;