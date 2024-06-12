const userController = {};
const bcryptjs = require("bcryptjs");
const User = require("../model/User");

userController.createUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw new Error("이미 존재하는 유저입니다.");
        }
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        const newUser = new User({ name, email, password: hash });
        await newUser.save();

        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(400).json({ status: "fail1", message: error.message });
    }
};

userController.getUser = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }

        res.status(200).json({ status: "success", user });
    } catch (error) {
        res.status(400).json({ status: "fail2", message: error.message });
    }
};

module.exports = userController;
