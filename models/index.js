const adm_employee = require("./adm_employee")
const adm_menu = require("./adm_menu")
const adm_menu_translations = require("./adm_menu_translations")
const adm_language = require("./adm_language")
const adm_user_login = require("./adm_user_login")
const adm_authentication = require("./adm_authentication")
const adm_user_token = require("./adm_user_token")
const mll_weight_control = require("./mll_weight_control")
const adm_company = require("./adm_company")
const mll_weigh_bridge = require("./mll_weigh_bridge")
const mll_grading = require("./mll_grading")
const adm_vehicle_number = require("./adm_vehicle_number")

const model = {};

model.adm_employee = adm_employee
model.adm_menu = adm_menu
model.adm_menu_translations = adm_menu_translations
model.adm_language = adm_language
model.adm_user_login = adm_user_login
model.adm_authentication = adm_authentication
model.adm_user_token = adm_user_token
model.mll_weight_control = mll_weight_control
model.adm_company = adm_company
model.mll_weigh_bridge = mll_weigh_bridge
model.mll_grading = mll_grading
model.adm_vehicle_number = adm_vehicle_number

module.exports = model;
