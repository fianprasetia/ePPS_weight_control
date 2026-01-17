var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.post("/", controller.payment_voucher.selectPaymentVoucher);

module.exports = router;
