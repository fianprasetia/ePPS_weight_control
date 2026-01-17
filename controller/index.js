const assign_employee_report = require("./assign_employee_report")
const purchase_request_quotation = require("./purchase_request_quotation")
const delete_file = require("./delete_file")
const purchase_order = require("./purchase_order")
const signature = require("./signature")
const goods_receipt = require("./goods_receipt")
const master_accounts_report = require("./master_accounts_report")
const trial_balance_report = require("./trial_balance_report")
const journal = require("./journal")
const goods_issue = require("./goods_issue")
const warehouse_inventory_report = require("./warehouse_inventory_report")
const warehouse_inventory_value_report = require("./warehouse_inventory_value_report")
const payment_voucher = require("./payment_voucher")
const translate = require("./translate")
const holiday = require("./holiday")
const comparison = require("./comparison")

const controller = {};

controller.assign_employee_report = assign_employee_report;
controller.purchase_request_quotation = purchase_request_quotation;
controller.delete_file = delete_file;
controller.purchase_order = purchase_order;
controller.signature = signature;
controller.goods_receipt = goods_receipt;
controller.master_accounts_report = master_accounts_report;
controller.trial_balance_report = trial_balance_report;
controller.journal = journal;
controller.goods_issue = goods_issue;
controller.warehouse_inventory_report = warehouse_inventory_report;
controller.warehouse_inventory_value_report = warehouse_inventory_value_report;
controller.payment_voucher = payment_voucher;
controller.translate = translate;
controller.holidays = holiday;
controller.comparison = comparison;

module.exports = controller;