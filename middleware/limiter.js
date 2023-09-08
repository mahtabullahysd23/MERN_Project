const rateLimit =require("express-rate-limit")
const {failure}= require("../utility/common")
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 10,
    message: failure("Too many login attempts , Try again later"),
})
module.exports = limiter;

