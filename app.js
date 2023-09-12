const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const ProductRouter = require("./routers/Product");
const UserRouter = require("./routers/User");
const OrderRouter = require("./routers/Order");
const AuthRouter = require("./routers/Auth");
const CartRouter = require("./routers/Cart");
const ReviewRouter = require("./routers/Review");
const {failure} = require('./utility/common');
const connectDB = require("./config/database");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");

app.use(cors({origin:'*'}));
app.use("/products", ProductRouter);
app.use("/orders", OrderRouter);
app.use("/users", UserRouter);
app.use("/auth", AuthRouter);
app.use("/cart", CartRouter);
app.use("/reviews", ReviewRouter);
app.use((req, res) => {
    res.status(404).send(failure("Page Not Found"));
  });

connectDB(() => {
  app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
});
});

