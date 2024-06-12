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
        res.status(400).json({ status: "fail1", message: error.message });
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
        res.status(400).json({ status: "fail2", message: error.message });
    }
};

authController.checkAdminPermission = async (req, res, next) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        if (user.level !== "admin") {
            throw new Error("권한이 없습니다.");
        }
        next();
    } catch (error) {
        res.status(400).json({ status: "fail3", message: error.message });
    }
};

authController.promiteToAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) throw new Error("유저를 찾을 수 없습니다.");
        user.level = "admin";
        await user.save();
        res.status(200).json({ status: "success", user });
    } catch (error) {
        res.status(400).json({ status: "fail4", message: error.message });
    }
};

module.exports = authController;
