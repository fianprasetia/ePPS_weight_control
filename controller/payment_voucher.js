const PDFDocument = require('pdfkit');
const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');
const eppsLib = require('./epps');
const controller = {};

controller.selectPaymentVoucher = async function (req, res) {
    const dataPaymentVoucher = req.body["dataPaymentVoucherPdf"][0]["payment_voucher_POST"];
    const jsonFilePath = path.join(__dirname, '../public/file/language.json');
    const data = await fsj.readFile(jsonFilePath, 'utf8');
    const translations = JSON.parse(data);
    const language = req.body["dataPaymentVoucherPdf"][0]["language_POST"];
    const messages = translations.find(item => item.language === language);
    const order = dataPaymentVoucher
    const code_payment_voucher = order["code_payment_voucher"];
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="payment_voucher.pdf"');

    const doc = new PDFDocument({
        size: 'A4',
        margins: {         // Mengatur margin
            top: 50,         // Margin atas
            bottom: 50,      // Margin bawah
            left: 30,        // Margin kiri
            right: 30        // Margin kanan
        }
    });
    function drawCheckboxWithLabel(doc, x, y, size, isChecked, label) {
        // Gambar kotak
        doc.rect(x, y, size, size)
            .stroke();

        // // Tambahkan centang (✓) jika terpilih
        // if (isChecked) {
        //     doc.font('Helvetica-Bold')
        //         .text('✓', x + 2, y - 1, { width: size, align: 'center' });
        // }

        // Tambahkan label di sebelah kanan kotak
        doc.font('Helvetica')
            .fontSize(10)
            .text(label, x + size + 5, y + 2);
    }
    const safeFileName = code_payment_voucher
    const outputPath = path.join(__dirname, '../public/file/payment_voucher/', `${safeFileName}.pdf`);
    doc.pipe(fs.createWriteStream(outputPath));


    if (language === "zh") {
        const mandarinFontPath = path.join(__dirname, '../public/file/font/NotoSansSC-Regular.ttf');
        doc.font(mandarinFontPath);
    }

    // Header
    const title = messages.content.payment_voucher.toUpperCase();
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#0665d0').text(title, { align: 'right' });
    // doc.fontSize(10).font('Helvetica').fillColor('black').text(`#${order.code_payment_voucher}`, { align: 'center' });
    doc.moveDown(1);
    let marginleft = doc.page.margins.left; // Titik awal vertikal (y-axis)
    let margintop = doc.page.margins.top; // Titik awal vertikal (y-axis)
    let starttop = margintop + 20
    let bgColor = '#0665d0';
    let bgColortext = '#ddddde';
    let headertop = margintop + 20;
    let rowHeight = 30;
    let textColor = 'white';
    let textColorData = 'black';
    let totalAmount = order.details.reduce((total, item) => total + item.amount, 0);
    doc.fontSize(10);
    doc.rect(marginleft, headertop + 10, 100, rowHeight).fill(bgColor).stroke().fillColor(textColor).text(`${messages.content.date.toUpperCase()}`, marginleft + 5, headertop + 22, { width: 100, align: 'left' });
    doc.rect(marginleft + 101, headertop + 10, 150, rowHeight).fill(bgColortext).stroke().fillColor(textColorData).text(`${eppsLib.ddmmyyyy(order.date_create)}`, marginleft + 101, headertop + 22, { width: 150, align: 'center' });
    doc.rect(marginleft + 252, headertop + 10, 100, rowHeight).fill(bgColor).stroke().fillColor(textColor).text(`${messages.content.partners.toUpperCase()}`, marginleft + 257, headertop + 22, { width: 100, align: 'left' });
    doc.rect(marginleft + 353, headertop + 10, 182.28, rowHeight).fill(bgColortext).stroke().fillColor(textColorData).text(`${order.log_partner.name.toUpperCase()}`, marginleft + 353, headertop + 22, { width: 182.28, align: 'center' });

    doc.rect(marginleft, headertop + 41, 100, rowHeight).fill(bgColor).stroke().fillColor(textColor).text(`${messages.content.no.toUpperCase()}`, marginleft + 5, headertop + 53, { width: 100, align: 'left' });
    doc.rect(marginleft + 101, headertop + 41, 150, rowHeight).fill(bgColortext).stroke().fillColor(textColorData).text(`${order.code_payment_voucher}`, marginleft + 101, headertop + 53, { width: 150, align: 'center' });
    doc.rect(marginleft + 252, headertop + 41, 100, rowHeight).fill(bgColor).stroke().fillColor(textColor).text(`${messages.content.contact_name.toUpperCase()}`, marginleft + 257, headertop + 53, { width: 100, align: 'left' });
    doc.rect(marginleft + 353, headertop + 41, 182.28, rowHeight).fill(bgColortext).stroke().fillColor(textColorData).text(`${order.log_partner.contact_person.toUpperCase()}`, marginleft + 353, headertop + 53, { width: 182.28, align: 'center' });

    doc.rect(marginleft, headertop + 80, 200, rowHeight).fill(bgColor).stroke().fillColor(textColor).text(`${messages.content.transaction_number.toUpperCase()}`, marginleft + 5, headertop + 92, { width: 200, align: 'left' });
    doc.rect(marginleft + 201, headertop + 80, 335.28, rowHeight).fill(bgColortext).stroke().fillColor(textColorData).text(`${order.no_invoice}`, marginleft + 206, headertop + 92, { width: 335.28, align: 'left' });
    doc.rect(marginleft, headertop + 111, 200, rowHeight).fill(bgColor).stroke().fillColor(textColor).text(`${messages.content.due_date.toUpperCase()}`, marginleft + 5, headertop + 123, { width: 200, align: 'left' });
    doc.rect(marginleft + 201, headertop + 111, 335.28, rowHeight).fill(bgColortext).stroke().fillColor(textColorData).text(`${eppsLib.ddmmyyyy(order.due_date)}`, marginleft + 206, headertop + 123, { width: 335.28, align: 'left' });
    doc.rect(marginleft, headertop + 142, 200, rowHeight).fill(bgColor).stroke().fillColor(textColor).text(`${messages.content.payment_amount.toUpperCase()}`, marginleft + 5, headertop + 154, { width: 200, align: 'left' });
    doc.rect(marginleft + 201, headertop + 142, 335.28, rowHeight).fill(bgColortext).stroke().fillColor(textColorData).text(`${eppsLib.formatRupiah(totalAmount)}`, marginleft + 206, headertop + 154, { width: 335.28, align: 'left' });
    doc.rect(marginleft, headertop + 173, 200, rowHeight).fill(bgColor).stroke().fillColor(textColor).text(`${messages.content.payment_method.toUpperCase()}`, marginleft + 5, headertop + 185, { width: 200, align: 'left' });
    // doc.rect(marginleft + 201, headertop + 173, 335.28, rowHeight).fill(bgColortext).stroke().fillColor(textColorData).text(`${eppsLib.formatRupiah(totalAmount)}`, marginleft + 206, headertop + 185, { width: 335.28, align: 'left' });
    doc.rect(marginleft + 201, headertop + 173, 335.28, rowHeight).fill(bgColortext).stroke();
    // Gambar checklist di dalam kotak abu-abu
    const checkboxSize = 10;
    const checkboxY = headertop + 173 + 5; // Posisi Y relatif terhadap rect
    const checkboxStartX = marginleft + 201 + 10; // Posisi X relatif terhadap rect
    let transfer = messages.content.transfer.toUpperCase()
    let cash = messages.content.cash.toUpperCase()
    let giro = messages.content.giro.toUpperCase()
    let cheque = messages.content.cheque.toUpperCase()
    const paymentMethods = [transfer, cash, giro, cheque];
    const checkboxTextOptions = { width: 200, align: 'left' }; // Parameter alignment text

    paymentMethods.forEach((method, index) => {
        const checkboxX = marginleft + 206 + (index * 80);
        const textX = checkboxX + checkboxSize + 5; // Posisi text setelah checkbox
        doc.rect(checkboxX, headertop + 185, checkboxSize, checkboxSize).stroke().fillColor('black').text(method, textX, headertop + 185 + 2, checkboxTextOptions);
    });

    doc.rect(marginleft, headertop + 213, 200, rowHeight).fill(bgColor).stroke().fillColor(textColor).text(`${messages.content.authorized_signature.toUpperCase()}`, marginleft + 5, headertop + 225, { width: 200, align: 'left' });
    doc.rect(marginleft + 201, headertop + 213, 335.28, rowHeight).fill(bgColortext).stroke().fillColor(textColorData)

    doc.end();

    res.status(200).json({
        access: "success",
        data: `${safeFileName}.pdf`,
    });
}

module.exports = controller;
