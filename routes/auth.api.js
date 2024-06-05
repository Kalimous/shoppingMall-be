const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.loginWithEmail);
router.post("/promite/:id", authController.promiteToAdmin);

module.exports = router;
