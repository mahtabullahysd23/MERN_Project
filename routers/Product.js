const express = require("express");
const { productValidator } = require("../middleware/validation");
const {isValidAdmin} = require("../middleware/auth")
const routes = express();
const ProductController = require("../controller/ProductController");

routes.get("/all",ProductController.getAll);
routes.get("/:id",ProductController.getOne);
routes.post("/create",isValidAdmin,productValidator.create,ProductController.create);
routes.patch("/update",isValidAdmin,productValidator.update,ProductController.update);
routes.delete("/delete/:id",isValidAdmin,ProductController.delete);


// routes.get("/sort/stock",ProductController.sortByStock);
// routes.patch("/restore/:id",ProductController.restore);
// routes.patch("/buy/:id/:quantity",ProductController.buyProduct);
module.exports = routes;