const express = require("express");
const router = express.Router();
const batch_controller = require("../controllers/batch.controller");
const batchToCarryUnits_controller = require("../controllers/batchToCarryUnits.controller");
const checkAuth = require("../middleware/check-auth");

// Batch registration operation routes
router.get("/", [checkAuth], batch_controller.batch_show_all);
router.post("/createBatch", [checkAuth], batch_controller.batch_create_new);
router.patch("/:batchId", [checkAuth], batch_controller.batch_delete);

// batchToCarryUnits routes
router.get("/batchToCarryUnits", [checkAuth], batchToCarryUnits_controller.batchToCarryUnits_show_all);
router.post("/batchToCarryUnits/createBatchToCarryUnit", [checkAuth], batchToCarryUnits_controller.batchToCarryUnits_create_new);
router.patch("/batchToCarryUnits/:batchToCarryUnitId", [checkAuth], batchToCarryUnits_controller.batchToCarryUnits_delete);

module.exports = router;
