const mongoose = require("mongoose");
const Product = require("./Product");
const User = require("./User.js");
const Schema = mongoose.Schema;
const OrderSchema = Schema(
    {
        userId: { type: mongoose.ObjectId, ref: User },
        status: { type: String, default: "preparing" },
        totalPrice: { type: Number, required: true, default: 0 },
        shipTo: { type: Object, required: true },
        contact: { type: Object, required: true },
        orderNum: { type: String },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: User,
        },
        items: [
            {
                productId: { type: mongoose.ObjectId, ref: Product },
                price: { type: Number, required: true },
                qty: { type: Number, required: true, default: 1 },
                size: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

OrderSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.__v;
    delete obj.updateAt;
    return obj;
};

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
