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
app.listen(8084);
console.log('8084 is the magic port');