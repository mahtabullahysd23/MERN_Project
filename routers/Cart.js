const express = require("express");
const routes = express();
const { cartValidator } = require("../middleware/validation");
const {isValidUser} = require("../middleware/auth")
const CartController = require("../controller/CartController");

routes.post("/add",cartValidator.add,CartController.add);
routes.patch("/remove",cartValidator.add,CartController.remove);

module.exports = routes;