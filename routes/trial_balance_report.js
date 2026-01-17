var express = require("express");
var router = express.Router();
const controller = require("../controller/index");
const multer = require('multer');
const upload = multer();

router.post("/", upload.single('data'), controller.trial_balance_report.selectTrialBalanceReport);

module.exports = router;
