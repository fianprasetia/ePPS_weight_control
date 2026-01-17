var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.post("/", controller.goods_receipt.selectGoodsReceipt);

module.exports = router;
