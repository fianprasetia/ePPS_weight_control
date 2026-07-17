var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.post("/", controller.partners.selectPartners);
router.post("/insert", controller.partners.insertPartners);
router.post("/bycode", controller.partners.selectPartnersByCode);
router.post("/update", controller.partners.updatePartners);

module.exports = router;
