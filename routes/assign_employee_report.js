var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.post("/", controller.assign_employee_report.selectAssignReport);

module.exports = router;
