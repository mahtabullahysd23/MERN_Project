const User = require("../model/UserClass");
const Auth = require("../model/AuthClass");
const { success, failure } = require('../utility/common');
const { validationResult } = require("express-validator");
const bycrypt = require("bcrypt");
const jsonWebtoken = require("jsonwebtoken");
class Authcontroller {
    async login(req, res) {
        try {
            if (validationResult(req).array().length > 0) {
                return res.status(400).send(failure("Validation Error", validationResult(req).array()));
            }
            const { email, password } = req.body;
            const logged = await Auth.findOne({ 'email.id': email });
            const loggedResponse = await Auth.findOne({ 'email.id': email }).select('-email -password -attempt -locked -unloackTime').populate('user');
            if (logged) {
                const match = await bycrypt.compare(password, logged.password);
                if (match) {
                    if (logged.email.status && !logged.locked) {
                        const token = jsonWebtoken.sign({
                            data: loggedResponse
                        }, process.env.JWT_KEY, { expiresIn: '1h' });
                        await Auth.findOneAndUpdate({ 'email.id': email }, { $set: { locked: false, unloackTime: Date.now(), attempt: 0 } })
                        return res.status(200).send(success("successfully Logged in !", { loggedResponse, token: token }));
                    }
                    else if (logged.email.status && logged.locked && logged.unloackTime > Date.now()) {
                        return res.status(404).send(failure("Too Many attempt,Your account Blocked for 24 hour"));
                    }
                    else if (logged.email.status && logged.locked && logged.unloackTime < Date.now()) {
                        const token = jsonWebtoken.sign({
                            data: loggedResponse
                        }, process.env.JWT_KEY, { expiresIn: '1h' });
                        await Auth.findOneAndUpdate({ 'email.id': email }, { $set: { locked: false, unloackTime: Date.now(), attempt: 0 } })
                        return res.status(200).send(success("successfully Logged in !", { loggedResponse, token: token }));
                    }
                    return res.status(400).send(failure("Please verify your email"));
                }
                const updateattempt = await Auth.findOneAndUpdate({ 'email.id': email }, { $inc: { attempt: 1 } })
                if (updateattempt.attempt >= 3) {
                    await Auth.findOneAndUpdate({ 'email.id': email }, { $set: { locked: true, unloackTime: Date.now() + 24 * 60 * 60 * 1000 } })
                    return res.status(404).send(failure("Too Many attempt,Your account Blocked for 24 hour"));
                }
                return res.status(400).send(failure("Invalid Credentials"));
            }

            return res.status(400).send(failure("Invalid Credentials"));
        }
        catch (e) {
            res.status(500).send(failure("Internal Server Error"));
        }
    }
    async signUp(req, res) {
        try {
            if (validationResult(req).array().length > 0) {
                return res.status(400).send(failure("Validation Error", validationResult(req).array()));
            }
            const { name, email, address, password } = req.body;
            const onlyemail = email.id;
            const salt = await bycrypt.genSalt(10);
            const hash = await bycrypt.hash(password, salt);
            const existvalidEmail = await Auth.findOne({ 'email.id': onlyemail, "email.status": true });
            const existEmail = await Auth.findOne({ 'email.id': onlyemail });
            if (existvalidEmail) {
                return res.status(400).send(failure("Email already exist"));
            }
            else if (existEmail && existEmail.email.status == false) {
                const updatedAuth = await Auth.findOneAndUpdate({ 'email.id': onlyemail }, { $set: { password: hash } });
                const updateUser = await User.findOneAndUpdate({ 'email': onlyemail }, { $set: { name: name, address: address } });
                if (updatedAuth && updateUser) {
                    const upauthfound = await Auth.findOne({ 'email.id': email.id }).select('-email -password -attempt -locked -unloackTime').populate('user');
                    return res.status(200).send(success("successfully Registered,Please verify your email", upauthfound));
                }
            }
            const user = await User.create({ name, email: onlyemail, address });
            const auth = await Auth.create({ email, password: hash, user: user._id });
            if (user && auth) {
                const authfound = await Auth.findOne({ 'email.id': email.id }).select('-email -password -attempt -locked -unloackTime').populate('user');
                return res.status(200).send(success("successfully Registered Please verify your email", authfound));
            }
            return res.status(404).send(failure("Registration failed"));
        }
        catch (e) {
            return res.status(500).send(failure("Internal Server Error"));
        }
    }
}

module.exports = new Authcontroller();