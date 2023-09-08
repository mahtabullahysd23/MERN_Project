const User = require("../model/UserClass");
const { success, failure } = require('../utility/common');
const { validationResult } = require("express-validator");
class UserController{

    async getAlluser(req, res) {
        try {
            const users = await User.find({})
            if (users) {
                return res.status(200).send(success("successfully Received all user", users));
            }
            return res.status(404).send(failure("user not found"));
            
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }

    }

}
module.exports = new UserController();