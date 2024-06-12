const mongoose = require("mongoose");
const Product = require("./Product");
const User = require("./User");
const Cart = require("./Cart");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            default: "preparing",
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        shipTo: {
            type: Object,
            required: true,
        },
        contact: {
            type: Object,
            required: true,
        },
        orderNum: {
            type: String,
            unique: true,
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                qty: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                size: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

// JSON 변환 시 불필요한 필드 제거
OrderSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    delete obj.updatedAt;
    return obj;
};

// 주문 저장 후 장바구니 비우기
OrderSchema.post("save", async function () {
    const cart = await Cart.findOne({ userId: this.userId });
    if (cart) {
        cart.items = [];
        cart.totalPrice = 0;
        cart.cartItemQty = 0;
        await cart.save();
    }
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
