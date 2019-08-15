const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const admin = require("../middleware/admin");

// Require the controllers
const user_controller = require("../controllers/user.controller");

// GET all users
router.get("/", user_controller.user_details_all);

// CREATE
router.post("/create", user_controller.user_create);

// READ
router.get("/:id", user_controller.user_details);

// UPDATE
router.patch("/:id/update", checkAuth, user_controller.user_update);

// DELETE
router.delete("/:id/delete", [checkAuth, admin], user_controller.user_delete);
module.exports = router;
