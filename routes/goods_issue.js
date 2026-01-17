var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.post("/", controller.goods_issue.selectGoodsIssue);

module.exports = router;
