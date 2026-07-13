var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.post("/insert", controller.weight_bridge.insertWeightBridge);
router.post("/update", controller.weight_bridge.updateWeightBridge);
router.post("/updatebystatus", controller.weight_bridge.updateWeightBridgeByStatus);
router.post("/", controller.weight_bridge.selectWeighBridge);
router.post("/bycode", controller.weight_bridge.selectWeighBrigeByCode);
router.post("/byticketno", controller.weight_bridge.selectWeighBrigeByTicketNo);

module.exports = router;
