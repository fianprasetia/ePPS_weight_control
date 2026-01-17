// load the things we need
var express = require('express');
// var app = express();
var path = require('path')
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
var cors = require('cors');
const os = require('os');
const { authorize } = require('./public/lib/authorize');

// set the view engine to ejs

var assignEmployeeReportRouter = require('./routes/assign_employee_report');
var purchaseRequestQuotationRouter = require('./routes/purchase_request_quotation');
var deleteFileRouter = require('./routes/delete_file');
var purchaseOrderRouter = require('./routes/purchase_order');
var signatureRouter = require('./routes/signature');
var goodsReceiptRouter = require('./routes/goods_receipt');
var masterAccountsReportRouter = require('./routes/master_accounts_report');
var trialBalanceRouter = require('./routes/trial_balance_report');
var journalRouter = require('./routes/journal');
var goodsIssueRouter = require('./routes/goods_issue');
var warehouseInventoryReportRouter = require('./routes/warehouse_inventory_report');
var warehouseInventoryValueReportRouter = require('./routes/warehouse_inventory_value_report');
var paymentVoucherRouter = require('./routes/payment_voucher');
var translateRouter = require('./routes/translate');
var holidayRouter = require('./routes/holiday');
var comparisonRouter = require('./routes/comparison');

var app = express();

app.use(cors());
app.use(bodyParser.json());



app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/file', express.static(path.join(__dirname, 'public/file/attendance')));
app.use('/sign', express.static(path.join(__dirname, 'public/file/signature')));


app.use('/employeeassignreport', assignEmployeeReportRouter);
app.use('/purchaserequestquotation', purchaseRequestQuotationRouter);
app.use('/deletefile', deleteFileRouter);
app.use('/purchaseorder', purchaseOrderRouter);
app.use('/signature', signatureRouter);
app.use('/goodsreceipt', goodsReceiptRouter);
app.use('/masteraccounts', masterAccountsReportRouter);
app.use('/trialbalance', trialBalanceRouter);
app.use('/journal', journalRouter);
app.use('/goodsissue', goodsIssueRouter);
app.use('/warehouseinventory', warehouseInventoryReportRouter);
app.use('/warehouseinventoryvalue', warehouseInventoryValueReportRouter);
app.use('/paymentvoucher', paymentVoucherRouter);
app.use('/translate', translateRouter);
app.use('/holiday', holidayRouter);
app.use('/comparison', comparisonRouter);

app.get('/', function (req, res) {
    res.render('pages/index');
});
app.get('/login', function (req, res) {
    res.render('pages/login');
});
app.get('/company', function (req, res) {
    res.render('pages/company');
});
app.get('/menu_directory', function (req, res) {
    res.render('pages/menu_directory');
});
app.get('/menu_mobile_directory', function (req, res) {
    res.render('pages/menu_mobile_directory');
});
app.get('/users', function (req, res) {
    res.render('pages/users');
});
app.get('/employee_data', function (req, res) {
    res.render('pages/employee_data');
});
app.get('/change-worksite', function (req, res) {
    res.render('pages/change_worksite');
});
app.get('/approval', function (req, res) {
    res.render('pages/approval');
});
app.get('/attendance_machine', function (req, res) {
    res.render('pages/attendance_machine');
});
app.get('/attendance', function (req, res) {
    res.render('pages/attendance');
});
app.get('/working_hours', function (req, res) {
    res.render('pages/working_hours');
});
app.get('/assign_employee', function (req, res) {
    res.render('pages/assign_employee');
});
app.get('/assign_employee_report', function (req, res) {
    res.render('pages/assign_employee_report');
});
app.get('/item_master', function (req, res) {
    res.render('pages/item_master');
});
app.get('/purchase_request_capex', function (req, res) {
    res.render('pages/purchase_request_capex');
});
app.get('/purchase_request_opex', function (req, res) {
    res.render('pages/purchase_request_opex');
});
app.get('/purchase_request_approval', function (req, res) {
    res.render('pages/purchase_request_approval');
});
app.get('/purchase_request_delegation', function (req, res) {
    res.render('pages/purchase_request_delegation');
});
app.get('/partners', function (req, res) {
    res.render('pages/partners');
});
app.get('/term_of_payment', function (req, res) {
    res.render('pages/term_of_payment');
});
app.get('/receiving_locations', function (req, res) {
    res.render('pages/receiving_locations');
});
app.get('/purchase_request_quotation', function (req, res) {
    res.render('pages/purchase_request_quotation');
});
app.get('/purchase_order', function (req, res) {
    res.render('pages/purchase_order');
});
app.get('/posting', function (req, res) {
    res.render('pages/posting');
});
app.get('/signature', function (req, res) {
    res.render('pages/signature');
});
app.get('/master_accounts', function (req, res) {
    res.render('pages/master_accounts');
});
app.get('/goods_receipt_warehouse', function (req, res) {
    res.render('pages/goods_receipt_warehouse');
});
app.get('/goods_receipt_asset', function (req, res) {
    res.render('pages/goods_receipt_asset');
});
app.get('/goods_receipt_approval', function (req, res) {
    res.render('pages/goods_receipt_approval');
});
app.get('/payment_voucher', function (req, res) {
    res.render('pages/payment_voucher');
});
app.get('/asset_type', function (req, res) {
    res.render('pages/asset_type');
});
app.get('/asset_subtype', function (req, res) {
    res.render('pages/asset_subtype');
});
app.get('/asset_inventory', function (req, res) {
    res.render('pages/asset_inventory');
});
app.get('/warehouse_close', function (req, res) {
    res.render('pages/warehouse_close');
});
app.get('/goods_issue', function (req, res) {
    res.render('pages/goods_issue');
});
app.get('/master_accounts_report', function (req, res) {
    res.render('pages/master_accounts_report');
});
app.get('/activity_type', function (req, res) {
    res.render('pages/activity_type');
});
app.get('/activity', function (req, res) {
    res.render('pages/activity');
});
app.get('/purchase_request_report', function (req, res) {
    res.render('pages/purchase_request_report');
});
app.get('/trial_balance_report', function (req, res) {
    res.render('pages/trial_balance_report');
});
app.get('/activity_log', function (req, res) {
    res.render('pages/activity_log');
});
app.get('/goods_issue_approval', function (req, res) {
    res.render('pages/goods_issue_approval');
});
app.get('/warehouse_inventory_report', function (req, res) {
    res.render('pages/warehouse_inventory_report');
});
app.get('/warehouse_inventory_value_report', function (req, res) {
    res.render('pages/warehouse_inventory_value_report');
});
app.get('/payment_voucher_type', function (req, res) {
    res.render('pages/payment_voucher_type');
});
app.get('/purchase_order_report', function (req, res) {
    res.render('pages/purchase_order_report');
});
app.get('/cash_bank', async function (req, res) {
    res.render('pages/cash_bank');
});
app.get('/bank_account', function (req, res) {
    res.render('pages/bank_account');
});
app.get('/transaction_unposting', function (req, res) {
    res.render('pages/transaction_unposting');
});
app.get('/pre_closing_period', function (req, res) {
    res.render('pages/pre_closing_period');
});
app.get('/closing_period', function (req, res) {
    res.render('pages/closing_period');
});
app.get('/open_accounting_period', function (req, res) {
    res.render('pages/open_accounting_period');
});
app.get('/harvest_penalty_type', function (req, res) {
    res.render('pages/harvest_penalty_type');
});
app.get('/block_master', function (req, res) {
    res.render('pages/block_master');
});
app.get('/harvest_penalty', function (req, res) {
    res.render('pages/harvest_penalty');
});
app.get('/harvest_incentive', function (req, res) {
    res.render('pages/harvest_incentive');
});
app.get('/average_bunch_weight', function (req, res) {
    res.render('pages/average_bunch_weight');
});
app.get('/department', function (req, res) {
    res.render('pages/department');
});
app.get('/basic_salary', function (req, res) {
    res.render('pages/basic_salary');
});
app.get('/holiday', function (req, res) {
    res.render('pages/holiday');
});
app.get('/language', function (req, res) {
    res.render('pages/language');
});
app.get('/benefit_in_kind', function (req, res) {
    res.render('pages/benefit_in_kind');
});
app.get('/harvest_activities', function (req, res) {
    res.render('pages/harvest_activities');
});
app.get('/factory_operations', function (req, res) {
    res.render('pages/factory_operations');
});
app.get('/maintenance_machine', function (req, res) {
    res.render('pages/maintenance_machine');
});
app.get('/sys_tkn_7412', function (req, res) {
    res.render('pages/sys_tkn_7412');
});

// app.get('/token', (req, res) => {
//     const accessToken = req.query.token;
//     console.log(accessToken)
//     res.cookie('dataToken', accessToken, {
//         httpOnly: true,   
//         secure: process.env.NODE_ENV === 'production', 
//         sameSite: 'strict', // Mencegah pengiriman cookie dengan permintaan lintas situs
//         maxAge: 1 * 60 * 60 * 1000 // Masa berlaku 1 hari
//     });
//     res.send('Cookie has been set');
// });
app.listen(8083);
console.log('8083 is the magic port');