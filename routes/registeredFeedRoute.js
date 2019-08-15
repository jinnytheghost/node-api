const express = require("express");
const router = express.Router();
const registeredFeed_controller = require("../controllers/registeredFeed.controller");
const checkAuth = require("../middleware/check-auth");

router.get("/feeds", [checkAuth], registeredFeed_controller.registeredFeed_show_all_feeds);
router.post("/createFeed", [checkAuth], registeredFeed_controller.registeredFeed_create_new_feed);
router.patch("/:feedId", [checkAuth], registeredFeed_controller.feed_delete);

module.exports = router;
