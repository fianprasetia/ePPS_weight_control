var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.post("/", controller.translate.translate);
router.post("/auto", controller.translate.autoTranslate);
router.post("/insert", controller.translate.inserttranslate);
router.post("/update", controller.translate.updateTranslate);

module.exports = router;
