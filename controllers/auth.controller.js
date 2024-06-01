const authController = {};
const User = require("../model/User");
const bcryptjs = require("bcryptjs");

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

module.exports = authController;
