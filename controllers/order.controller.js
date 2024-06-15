const randomStringGenerator = require("../utils/randomStringGenerator");
const productController = require("./product.controller");
const Order = require("../model/Order");
const mongoose = require("mongoose");

const orderController = {};
const PAGE_SIZE = 20;

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
        res.status(400).json({ status: "fail1", message: error.message });
    }
};

orderController.getOrders = async (req, res) => {
    try {
        const { page = 1, orderNum } = req.query;
        const cond = {
            ...(orderNum && { orderNum: { $regex: orderNum, $options: "i" } }), // orderNum 필터링 조건 추가
        };

        const totalItemNum = await Order.find(cond).countDocuments();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

        const orderList = await Order.find(cond)
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .populate("userId")
            .populate("items.productId")
            .exec();

        const response = {
            status: "success",
            totalPageNum,
            data: orderList,
        };

        res.status(200).json(response);
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

        if (!order) {
            throw new Error("주문이 존재하지 않습니다");
        }

        res.status(200).json({ status: "success", order });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "fail3", message: error.message });
    }
};

orderController.getMyOrder = async (req, res) => {
    try {
        const { userId } = req;
        const orders = await Order.find({ userId: userId })
            .populate("items.productId")
            .populate("userId");
        console.log(orders);
        if (!orders || orders.length === 0) {
            throw new Error("주문이 존재하지 않습니다");
        }
        res.status(200).json({ status: "success", orders });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = orderController;
