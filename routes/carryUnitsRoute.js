const express = require("express");
const router = express.Router();
const carry_unit_type_controller = require("../controllers/carryUnitType.controller");
const carry_unit_controller = require("../controllers/carryUnit.controller");
const checkAuth = require("../middleware/check-auth");

// Carry Units Types routes
router.get("/types", [checkAuth], carry_unit_type_controller.cut_show_all);
router.post("/types/createCarryUnit", [checkAuth], carry_unit_type_controller.cut_create_new);
router.patch("/types/:carryUnitId", [checkAuth], carry_unit_type_controller.cut_delete);
router.get("/types/:carryUnitId", [checkAuth], carry_unit_type_controller.cut_details);

// Carry Units routes
router.get("/", [checkAuth], carry_unit_controller.cu_show_all);
router.post("/createCarryUnit", [checkAuth], carry_unit_controller.cu_create_new);
router.patch("/:carryUnitId", [checkAuth], carry_unit_controller.cu_delete);
router.get("/:carryUnitId", [checkAuth], carry_unit_controller.cu_details);

module.exports = router;
