const Product = require("../model/ProductClass");
const { success, failure } = require('../utility/common');
const { validationResult } = require("express-validator");

const time = () => {
    return `${new Date().getHours() > 12 ? (new Date().getHours() - 12) : new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}:${new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()} ${new Date().getHours() >= 12 ? "PM" : "AM"} (${(new Date().getMonth() + 1)}/${new Date().getDate()}/${new Date().getFullYear()})`;
}
class ProductController {
    async getAll(req, res) {
        try {
            let limit = 10;
            let page = 1;
            let search = [/.*/];
            let sortCriteria = {};
            let sortByType = "asc";
            let price = {};
            let stock = {};
            let name = [/.*/];
            let author = [/.*/];
            const count = await Product.find({}).count();
            const { Page, Limit, Search, SortBy, SortByType, Price, Stock, priceOperator, stockOperator, Name, Author } = req.query;
            if (Page) {
                page = Page;
            }
            if (Limit) {
                limit = Limit;
            }
            if (Search) {
                search = [];
                if (Array.isArray(Search)) {
                    Search.forEach(element => {
                        search.push(new RegExp(element, 'i'));
                    });
                }
                else {
                    search.push(new RegExp(Search, 'i'));
                }
            }
            if (Name) {
                name = [];
                if (Array.isArray(Name)) {
                    Name.forEach(element => {
                        name.push(new RegExp(element, 'i'));
                    });
                }
                else {
                    name.push(new RegExp(Name, 'i'));
                }
            }
            if (Author) {
                author = [];
                if (Array.isArray(Author)) {
                    Author.forEach(element => {
                        author.push(new RegExp(element, 'i'));
                    });
                }
                else {
                    author.push(new RegExp(Author, 'i'));
                }
            }
            if (SortBy) {
                if (SortByType) {
                    sortByType = SortByType;
                }
                if (sortByType === "asc") {
                    sortCriteria[SortBy] = 1;
                }
                else if (sortByType === "desc") {
                    sortCriteria[SortBy] = -1;
                }
                else {
                    return res.status(404).send(failure("Wrong sorting criteria"));
                }
            }
            if (Price) {
                if (priceOperator === 'gt') {
                    price = {
                        price: {
                            $gt: Price
                        }
                    }
                }
                else if (priceOperator === 'gte') {
                    price = {
                        price: {
                            $gte: Price
                        }
                    }
                }
                else if (priceOperator === 'lt') {
                    price = {
                        price: {
                            $lt: Price
                        }
                    }
                }
                else if (priceOperator === 'lte') {
                    price = {
                        price: {
                            $lte: Price
                        }
                    }
                }
                else if (priceOperator === 'eq') {
                    price = {
                        price: {
                            $eq: Price
                        }
                    }
                }
                else {
                    return res.status(404).send(failure("Wrong filtering condition for price"));
                }
            }

            if (Stock) {
                
                if (stockOperator === 'gt') {
                    stock = {
                        stock: {
                            $gt: Stock
                        }
                    }
                }
                else if (stockOperator === 'gte') {
                    stock = {
                        stock: {
                            $gte: Stock
                        }
                    }
                }
                else if (stockOperator === 'lt') {
                    stock = {
                        stock: {
                            $lt: Stock
                        }
                    }
                }
                else if (stockOperator === 'lte') {
                    stock = {
                        stock: {
                            $lte: Stock
                        }
                    }
                }
                else if (stockOperator === 'eq') {
                    stock = {
                        stock: {
                            $eq: Stock
                        }
                    }
                }
                else {
                    return res.status(404).send(failure("Wrong filtering condition for price"));
                }
            }

            const product = await Product.find({
                $and: [
                    {
                        $or: [
                            { author: { $in: search } },
                            { name: { $in: search } }
                        ]
                    },
                    {
                        $and: [
                            {
                                name: { $in: name }
                            },
                            {
                                author: { $in: author }
                            }
                        ]
                    },
                    price,
                    stock,
                ]
            })
                .sort(sortCriteria)
                .skip((page - 1) * limit)
                .limit(limit);
            const onthisPage = product.length;
            if (product.length > 0) {
                return res.status(200).send(success("successfully Received Product", { Total: count, page: Number(page), limit: Number(limit), OnThisPage: onthisPage, product }));
            }
            return res.status(404).send(failure("No Product Found"));
        }
        catch (e) {
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const productbyID = await Product.findById({ _id: id });
            if (productbyID) {
                return res.status(200).send(success("successfully Received Product", productbyID));
            }
            return res.status(404).send(failure(`No Product Found with id ${id}`));
        }
        catch (e) {
            return res.status(500).send(failure("Internal Server Error"));
        }
    }
    async create(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return res.status(400).send(failure("Validation Error", validation));
            }
            const product = req.body;
            const created = await Product.create(product);
            if (created) {
                return res.status(200).send(success("successfully Created Product", created));
            }
            return res.status(404).send(failure("Product Not Created"));
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }
    async update(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return res.status(400).send(failure("Validation Error", validation));
            }
            const { id } = req.query;
            const product = req.body;
            try {
                const updated = await Product.updateOne({ _id: id }, product);
                if (updated.modifiedCount > 0) {
                    return res.status(200).send(success("successfully Updated Product", updated));
                }
                else if (updated.matchedCount > 0) {
                    return res.status(200).send(success("No changes made"));
                }
                return res.status(404).send(failure(`No Product Found with id ${id}`));
            }
            catch (e) {
                return res.status(404).send(failure(`No Product Found with id ${id}`));
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error"));
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Product.deleteOne({ _id: id });
            if (deleted.deletedCount > 0) {
                return res.status(200).send(success("successfully Deleted Product", deleted));
            }
            return res.status(404).send(failure(`No Product Found with id ${id}`));
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }

    }

    async restore(req, res) {
        try {

        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }

    async sortByStock(req, res) {
        try {

        }
        catch (e) {
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }

    async buyProduct(req, res) {
        try {
        }
        catch (e) {
            return res.status(500).send(failure("Internal Server Error", e));
        }

    }

}

module.exports = new ProductController();