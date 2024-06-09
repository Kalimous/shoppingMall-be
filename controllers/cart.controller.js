const { populate } = require("dotenv");
const Cart = require("../model/Cart");

const cartController = {};

cartController.addCart = async (req, res) => {
    try {
        const { userId } = req;
        const { productId, size, qty } = req.body;
        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            cart = new Cart({ userId });
            await cart.save();
        }
        const existItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.size === size
        );
        if (existItem) {
            throw new Error("아이템이 이미 카트에 담겨 있습니다");
        }
        cart.items = [...cart.items, { productId, size, qty }];
        await cart.save();
        res.status(200).json({
            status: "success",
            data: cart,
            cartItemQty: cart.items.length,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

cartController.getCartItemCount = async (req, res) => {
    try {
        const { user } = req.body;
        const userId = user._id;

        const cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            throw new Error("카트가 없습니다");
        }

        res.status(200).json({
            status: "success",
            data: cart,
            cartItemQty: cart.items.length,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

cartController.getAllCartItems = async (req, res) => {
    try {
        const { userId } = req;
        const cart = await Cart.find({ userId: userId }).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product",
            },
        });

        res.status(200).json({ status: "success", data: cart });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

cartController.deleteCartItem = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.body;
        const cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            throw new Error("카트가 없습니다");
        }

        cart.items = cart.items.filter((item) => !item._id.equals(id));

        await cart.save();

        res.status(200).json({
            status: "success",
            data: cart,
            cartItemQty: cart.items.length,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = cartController;

//유저를 가지고 카트 찾기
//유저가 만든 카드가 없다, 만들어주기
//이미 카트에 있는 아이템이면 에러
//카트에 아이템을 추가
