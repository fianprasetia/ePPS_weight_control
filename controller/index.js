
const login = require("./login")
const menu = require("./menu")
const language = require("./language")
const translate = require("./translate")
const users = require("./users")
const employee = require("./employee")
const mill_activation = require("./mill_activation")
const company = require("./company")
const vehicle_number = require("./vehicle_number")
const weight_bridge = require("./weight_bridge")
const print_ticket = require("./print_ticket")
const partners = require("./partners")


const controller = {};

controller.login = login;
controller.menu = menu;
controller.language = language;
controller.translate = translate;
controller.users = users;
controller.employee = employee;
controller.mill_activation = mill_activation;
controller.company = company;
controller.vehicle_number = vehicle_number;
controller.weight_bridge = weight_bridge;
controller.print_ticket = print_ticket;
controller.partners = partners;


module.exports = controller;
