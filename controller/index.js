
const login = require("./login")
const menu = require("./menu")
const language = require("./language")
const translate = require("./translate")


const controller = {};

controller.login = login;
controller.menu = menu;
controller.language = language;
controller.translate = translate;


module.exports = controller;
