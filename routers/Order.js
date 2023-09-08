const express = require("express");
const routes = express();
const OrderController = require("../controller/OrderController");
const {isValidAdmin} = require("../middleware/auth");
const {isValidUser} = require("../middleware/auth");

routes.post("/create",isValidUser,OrderController.create);
routes.get("/getAllOrders",isValidAdmin,OrderController.getAllOrders);

module.exports = routes;