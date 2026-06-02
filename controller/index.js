
const login = require("./login")
const menu = require("./menu")
const language = require("./language")
const translate = require("./translate")
const users = require("./users")
const employee = require("./employee")


const controller = {};

controller.login = login;
controller.menu = menu;
controller.language = language;
controller.translate = translate;
controller.users = users;
controller.employee = employee;


module.exports = controller;
