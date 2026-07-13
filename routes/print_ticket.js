var express = require("express");
var router = express.Router();
const controller = require("../controller/index");

router.post("/:ticketNo", controller.print_ticket.selectPrintTicket);

module.exports = router;
