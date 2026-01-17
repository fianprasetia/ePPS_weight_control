const PDFDocument = require('pdfkit');
const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');
const eppsLib = require('./epps');
const controller = {};

controller.selectGoodsReceipt = async function (req, res) {
    const dataGoodsReceipt = req.body["dataGoodsReceiptPdf"][0]["goods_receipt_POST"];
    const dataSignature = req.body["dataGoodsReceiptPdf"][0]["signature_POST"];
    const imageSignature = dataSignature[0]["image"]
    const jsonFilePath = path.join(__dirname, '../public/file/language.json');
    const data = await fsj.readFile(jsonFilePath, 'utf8');
    const translations = JSON.parse(data);

    const language = req.body["dataGoodsReceiptPdf"][0]["language_POST"];
    const messages = translations.find(item => item.language === language);

    const order = dataGoodsReceipt
    const imageEmployeeWarehouse = dataGoodsReceipt["employeeSignature"]["photo"]
    const code_goods_receipt = order["code_goods_receipt"];
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="purchase_request_quotation.pdf"');

    const doc = new PDFDocument({
        size: 'A4',
        margins: {         // Mengatur margin
            top: 50,         // Margin atas
            bottom: 50,      // Margin bawah
            left: 30,        // Margin kiri
            right: 30        // Margin kanan
        }
    });

    const safeFileName = code_goods_receipt.replace(/\//g, '_'); // Mengganti '/' dengan '_'
    const outputPath = path.join(__dirname, '../public/file/receipt/', `${safeFileName}.pdf`);
    doc.pipe(fs.createWriteStream(outputPath));


    if (language === "zh") {
        const mandarinFontPath = path.join(__dirname, '../public/file/font/NotoSansSC-Regular.ttf');
        doc.font(mandarinFontPath);
    }

    // Header
    const title = messages.content.proof_of_delivery.toUpperCase();
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#0665d0').text(title, { align: 'center' });
    doc.fontSize(10).font('Helvetica').fillColor('black').text(`#${order.code_goods_receipt.toUpperCase()}`, { align: 'center' });
    doc.moveDown(1);


    // doc.fontSize(20).fillColor('#0665d0').text(messages.content.proof_of_delivery.toUpperCase(), { align: 'left' })
    // doc.fontSize(10).fillColor('black').text(`#${order.code_goods_receipt.toUpperCase()}`, { align: 'left' })
    // doc.moveDown(1);
    let marginleft = doc.page.margins.left; // Titik awal vertikal (y-axis)
    let margintop = doc.page.margins.top; // Titik awal vertikal (y-axis)
    let starttop = margintop + 60
    let bgColor = '#0665d0';
    // Informasi Perusahaan (di kiri)
    doc.fontSize(10);
    // const headerData = [
    //   [`${messages.content.warehouse.toUpperCase()}:`, `${order.warehouse.toUpperCase()}`],
    //   [`${messages.content.purchase_order.toUpperCase()}:`, `#${order.code_purchase_order.toUpperCase()}`],
    //   [`${messages.content.no_shipping_document.toUpperCase()}:`, `#${order.shipping.toUpperCase()}`],
    //   [`${messages.content.no_invoice.toUpperCase()}:`, `#${order.invoice.toUpperCase()}`],
    //   [`${messages.content.status.toUpperCase()}:`, `${messages.content.confirmed.toUpperCase()}`]
    // ];
    // headerData.forEach(([label, value]) => {
    //     doc.font('Helvetica-Bold').text(label, { continued: true }).font('Helvetica').text(value);
    //   });


    doc.fontSize(9).fillColor('black').text(`${messages.content.warehouse.toUpperCase()}: ${order.warehouse.toUpperCase()}`, marginleft, starttop);
    doc.fontSize(9).text(`${messages.content.purchase_order.toUpperCase()}: ${order.code_purchase_order.toUpperCase()}`, marginleft, doc.y);
    doc.fontSize(9).text(`${messages.content.no_shipping_document.toUpperCase()}: ${order.shipping.toUpperCase()}`, marginleft, doc.y);
    doc.fontSize(9).text(`${messages.content.no_invoice.toUpperCase()}: ${order.invoice.toUpperCase()}`, marginleft, doc.y);
    doc.fontSize(9).text(`${messages.content.status.toUpperCase()}: ${messages.content.confirmed.toUpperCase()}`, marginleft, doc.y);
    doc.moveDown(2);
    const lineY = starttop + 55; // Posisi garis di bawah teks
    doc.strokeColor(bgColor).strokeOpacity(0.3).moveTo(30, lineY).lineTo(563, lineY).stroke();
    let texttop = starttop + 70
    doc.fontSize(9).text(messages.content.text_gr.replace("{{date}}", eppsLib.ddmmyyyy(order.date)).replace("{{warehouse}}", order.warehouse).replace("{{partner}}", order.log_purchase_order.log_partner.name).toUpperCase(), marginleft, texttop);

    let headertop = starttop + 85;
    let rowHeight = 20;
    let textColor = 'white';
    doc.fontSize(10);
    // doc.text(`${messages.content.purchase_request.toUpperCase()}` + ' #' + order.code_purchase_request, 30, headertop, { align: 'left' })
    doc.rect(30, headertop + 10, 20, rowHeight).fill(bgColor).fillColor(textColor).text(`#`, 30, headertop + 16, { width: 20, align: 'center' });
    doc.rect(50, headertop + 10, 100, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.code_item.toUpperCase()}`, 50, headertop + 16, { width: 100, align: 'center' });
    doc.rect(150, headertop + 10, 271, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.description.toUpperCase()}`, 150, headertop + 16, { width: 271, align: 'center' });
    doc.rect(421, headertop + 10, 71, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.uom.toUpperCase()}`, 421, headertop + 16, { width: 71, align: 'center' });
    doc.rect(492, headertop + 10, 71, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.qty.toUpperCase()}`, 492, headertop + 16, { width: 71, align: 'center' });

    // Detail Item
    let yBody = headertop + 35
    let counter = 1;
    order.details.forEach(item => {
        const total = item.qty * item.price;

        doc.fillColor('black')
        doc.text(counter, 30, yBody, { width: 20, align: 'center' })
        doc.text(item.code_item, 50, yBody, { width: 100, align: 'center' })
        doc.text(item.log_item_master.name.toUpperCase(), 150, yBody, { width: 271, align: 'center' })
        doc.text(item.log_item_master.uom.toUpperCase(), 421, yBody, { width: 71, align: 'center' })
        doc.text(item.qty, 492, yBody, { width: 71, align: 'right' })
        const lineY = yBody + 12; // Posisi garis di bawah teks
        doc.strokeColor(bgColor).strokeOpacity(0.3).moveTo(30, lineY).lineTo(563, lineY).stroke();
        yBody += 17
        counter++;
    });


    let receiptTOC = yBody + 15;
    const imagePathReceipt = path.join(__dirname, '../public/file/signature/', `${imageEmployeeWarehouse}`);
    const imageMarginTopReceipt = 10;
    const contentWidthReceipt = 182; // Lebar area yang sama dengan teks
    const contentXReceipt = 20;
    doc.text(`${messages.content.received_by.toUpperCase()}`, 20, receiptTOC, { width: 182, align: 'center' })
    if (fs.existsSync(imagePathReceipt)) {
        const imageX = contentXReceipt + (contentWidthReceipt - 120) / 2
        doc.image(imagePathReceipt, {
            height: 120,
            x: imageX, // Samakan dengan posisi x teks
            y: receiptTOC + imageMarginTopReceipt, // Hitung posisi y berdasarkan tinggi teks dan margin
            align: 'center'
        });
    } else {
        console.error('Signature image not found:', imagePathReceipt);
    }
    doc.text(order.employeeWarehouse.fullname.toUpperCase(), 20, receiptTOC + 130, { width: 182, align: 'center' })

    let approveTOC = yBody + 15;
    const imagePath = path.join(__dirname, '../public/file/signature/', `${imageSignature}`);
    const imageMarginTop = 10;
    const contentWidth = 182; // Lebar area yang sama dengan teks
    const contentX = 381;
    doc.text(`${messages.content.approve_by.toUpperCase()}`, 381, approveTOC, { width: 182, align: 'center' })
    if (fs.existsSync(imagePath)) {
        const imageX = contentX + (contentWidth - 120) / 2
        doc.image(imagePath, {
            height: 120,
            x: imageX, // Samakan dengan posisi x teks
            y: approveTOC + imageMarginTop, // Hitung posisi y berdasarkan tinggi teks dan margin
            align: 'center'
        });
    } else {
        console.error('Signature image not found:', imagePath);
    }
    doc.text(order.log_goods_receipt_approvals[0].hrd_employee.fullname.toUpperCase(), 381, approveTOC + 130, { width: 182, align: 'center' })
    
    doc.end();

    res.status(200).json({
        access: "success",
        data: `${safeFileName}.pdf`,
    });
}

module.exports = controller;
