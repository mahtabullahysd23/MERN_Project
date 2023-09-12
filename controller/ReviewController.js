const Review = require('../model/ReviewClass');
const User = require('../model/UserClass');
const Product = require('../model/ProductClass');
const { success, failure } = require('../utility/common');
const { validationResult } = require("express-validator");

class ReviewController {

    async add(req, res) { 
        try{
            const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(failure("Validation Error", errors.array()));
        }
        const review = req.body;
        const extUser = await User.findById({ _id: review.user });
        const extProduct = await Product.findById({ _id: review.product });
        const extReview = await Review.findOne({ user: review.user, product: review.product });
        if (!extUser) {
            return res.status(400).send(failure("User does not exist"));
        }
        if (!extProduct) {
            return res.status(400).send(failure("Product does not exist"));
        }
        if (extReview) {
            return res.status(400).send(failure("You can not review same product twice"));
        }
        const reviewitem = {   
            user: review.user,
            product: review.product,
            rating: review.rating,
            review: review.review
        }
        const newReview = new Review(reviewitem);
        const savedReview = await newReview.save();
        const extProduct1 = await Product.findById({ _id: review.product });
        const updatedProduct = await Product.updateOne({ _id: review.product }, { $push: { reviews: savedReview._id } });
        const totalreviews = extProduct1.reviews.length; 
        const newRating = (extProduct.rating + review.rating) / (totalreviews+1);
        const updatedRating = await Product.updateOne({ _id: review.product }, { $set: { rating: newRating } });
        if (savedReview && updatedProduct && updatedRating) {
            return res.status(200).send(success("Review added successfully", savedReview));
        }
        return res.status(404).send(failure("Review not added"));
        }
        catch(err){
            return res.status(500).send(failure("Server Error"));
        }
    } 
    
    async getAll(req, res) {

        try {
            const reviews = await Review.find({});
            if (reviews) {
                return res.status(200).send(success("successfully Received all reviews", reviews));
            }
            return res.status(404).send(failure("reviews not found"));

        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }

    }

    async getByID(req, res) {
        try {
            const review = await Review.findById({ _id: req.params.id }).populate('user').populate('product','-rating -reviews -stock');
            if (review) {
                return res.status(200).send(success("successfully Received review", review));
            }
            return res.status(404).send(failure("review not found"));

        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }

    }

}

module.exports = new ReviewController();