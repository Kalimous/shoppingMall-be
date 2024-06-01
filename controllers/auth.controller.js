const authController = {};
const User = require("../model/User");
const bcryptjs = require("bcryptjs");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");

authController.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            const isMatch = await bcryptjs.compare(password, user.password);
            if (isMatch) {
                const token = await user.generateToken();
                res.status(200).json({ status: "success", user, token });
            } else {
                throw new Error("잘못된 이메일 또는 비밀번호입니다.");
            }
        } else {
            throw new Error("잘못된 이메일 또는 비밀번호입니다.");
        }
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

authController.authenticate = async (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;
        if (!tokenString) throw new Error("토큰이 존재하지 않습니다.");

        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
            if (error) {
                throw new Error("토큰값이 일치하지 않습니다.");
            }
            req.userId = payload._id;
        });
        next();
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = authController;
