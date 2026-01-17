const adm_employee = require("./adm_employee")
const adm_menu = require("./adm_menu")
const adm_menu_translations = require("./adm_menu_translations")
const adm_language = require("./adm_language")
const adm_user_login = require("./adm_user_login")
const adm_authentication = require("./adm_authentication")

const model = {};

model.adm_employee = adm_employee
model.adm_menu = adm_menu
model.adm_menu_translations = adm_menu_translations
model.adm_language = adm_language
model.adm_user_login = adm_user_login
model.adm_authentication = adm_authentication

module.exports = model;
