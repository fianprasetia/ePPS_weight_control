var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.delete("/", controller.delete_file.deleteFile);

module.exports = router;
