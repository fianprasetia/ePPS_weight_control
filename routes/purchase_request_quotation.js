var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.post("/", controller.purchase_request_quotation.selectPurchaseRequestQuotation);

module.exports = router;
