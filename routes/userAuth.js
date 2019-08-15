const express = require("express");
const router = express.Router();

// controller userAuth
const userAuth_controller = require("../controllers/userAuth.controller");

// sign Up
router.post("/signup", userAuth_controller.userAuth_signup);

// login
router.post("/login", userAuth_controller.userAuth_login);

// delete user
router.delete("/:userId", userAuth_controller.userAuth_delete);

// get userAuth details
router.get("/:userId", userAuth_controller.userAuth_details);

// verify user
router.post("/verify", userAuth_controller.userAuth_verify);

module.exports = router;
