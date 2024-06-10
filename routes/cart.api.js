const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const cartController = require("../controllers/cart.controller");

router.post("/", authController.authenticate, cartController.addCart);
router.post(
    "/cartSize",
    authController.authenticate,
    cartController.getCartItemCount
);
router.get("/", authController.authenticate, cartController.getAllCartItems);
router.delete("/", authController.authenticate, cartController.deleteCartItem);
router.post('/setItemQty', authController.authenticate, cartController.setItemQty)

module.exports = router;
