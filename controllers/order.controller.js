const randomStringGenerator = require("../utils/randomStringGenerator");
const productController = require("./product.controller");
const Order = require("../model/Order");
const mongoose = require("mongoose");

const orderController = {};
const PAGE_SIZE = 10;

orderController.createOrder = async (req, res) => {
    try {
        const { userId } = req;

        const { shipTo, contact, totalPrice, orderList } = req.body;

        const insufficientStockItems =
            await productController.checkItemListStock(orderList);

        if (insufficientStockItems.length > 0) {
            const errorMessage = insufficientStockItems.reduce(
                (total, item) => (total += item.message),
                ""
            );
            throw new Error(errorMessage);
        }

        const newOrder = new Order({
            userId,
            totalPrice,
            shipTo,
            contact,
            items: orderList,
            orderNum: randomStringGenerator(),
        });

        await newOrder.save();
        res.status(200).json({
            status: "success",
            orderNum: newOrder.orderNum,
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

orderController.getOrder = async (req, res) => {
    try {
        const { page = 1, ordernum } = req.query;

        const cond = {
            ...(ordernum && { ordernum: { $regex: ordernum, $options: "i" } }),
        };

        let query = await Order.find(cond);

        console.log(query);

        // console.log(query);
        const { userId } = req; // userId는 req 객체에서 가져옵니다.
        const orders = await Order.find({ userId })
            .populate("items.productId")
            .populate("userId")
            .exec();
        res.status(200).json({ status: "success", orders });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

orderController.updateOrder = async (req, res) => {
    try {
        const { userId } = req;
        const { orderId, status } = req.body;

        // ObjectId 변환
        const orderObjectId = new mongoose.Types.ObjectId(orderId);

        // 주문 업데이트
        const order = await Order.findByIdAndUpdate(
            orderObjectId,
            { status },
            { new: true, runValidators: true }
        ).populate("items.productId");

        console.log(order);

        if (!order) {
            throw new Error("주문이 존재하지 않습니다");
        }

        res.status(200).json({ status: "success", order });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = orderController;
