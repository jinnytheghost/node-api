const express = require("express");
const router = express.Router();
const stages_controller = require("../controllers/stages.controller");
const checkAuth = require("../middleware/check-auth");

router.get("/", [checkAuth], stages_controller.stages_show_all);
router.post("/createStage", [checkAuth], stages_controller.stages_create_new);
router.patch("/:stageId", [checkAuth], stages_controller.stages_delete);

module.exports = router;
