const express = require("express");
const router = express.Router();
const registeredSubstrate_controller = require("../controllers/registeredSubstrate.controller");
const checkAuth = require("../middleware/check-auth");

router.get("/substrates", [checkAuth], registeredSubstrate_controller.registeredSubstrate_show_all_substrates);
router.post("/createSubstrate", [checkAuth], registeredSubstrate_controller.registeredSubstrate_create_new_substrate);
router.patch("/:substrateId", [checkAuth], registeredSubstrate_controller.substrate_delete);

module.exports = router;
