const express = require("express");
const routes = express();
const AuthController = require("../controller/AuthController");
const {authvalidator} = require("../middleware/validation");
const limiter = require("../middleware/limiter");

routes.post("/signup",authvalidator.signUp,AuthController.signUp);
routes.post("/login",limiter,authvalidator.login,AuthController.login);

module.exports = routes;