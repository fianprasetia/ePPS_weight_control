
const login = require("./login")
const menu = require("./menu")
const language = require("./language")
const translate = require("./translate")
const users = require("./users")
const employee = require("./employee")
const mill_activation = require("./mill_activation")
const company = require("./company")
const vehicle_number = require("./vehicle_number")


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


module.exports = controller;
