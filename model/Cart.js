const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Product");
const Schema = mongoose.Schema;
const CartSchema = Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: User },
        itmes: [
            {
                productId: { type: mongoose.Types.ObjectId, ref: Product },
                size: { type: String, required: true },
                qty: { type: Number, required: true },
            },
        ],
    },
    { timestamps: true }
);

CartSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;
    return obj;
};

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
