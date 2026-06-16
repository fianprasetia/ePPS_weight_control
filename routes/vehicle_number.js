var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.post("/", controller.vehicle_number.selectVehicleNumber);
router.post("/insert", controller.vehicle_number.insertVehicleNumber);
router.post("/bycode", controller.vehicle_number.selectVehicleNumberByCode);
router.post("/update", controller.vehicle_number.updateVehicleNumber);


module.exports = router;
