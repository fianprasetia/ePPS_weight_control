var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.post("/", controller.mill_activation.selectWeightControl);
router.post("/insert", controller.mill_activation.insertWeightControl);
// router.post("/auto", controller.translate.autoTranslate);
// router.post("/update", controller.translate.updateTranslate);

module.exports = router;
