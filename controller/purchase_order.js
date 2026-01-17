const PDFDocument = require('pdfkit');
const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');
const eppsLib = require('./epps');
const controller = {};

controller.selectPurchaseOrder = async function (req, res) {
    const dataPurchaseOrder = req.body["dataPurchaseOrderPdf"][0]["purchase_order_POST"];
    const dataSignature = req.body["dataPurchaseOrderPdf"][0]["signature_POST"];
    const imageSignature = dataSignature["photo"]
    const jsonFilePath = path.join(__dirname, '../public/file/language.json');
    const data = await fsj.readFile(jsonFilePath, 'utf8');
    const translations = JSON.parse(data);

    const language = req.body["dataPurchaseOrderPdf"][0]["language_POST"];
    const messages = translations.find(item => item.language === language);

    const order = dataPurchaseOrder
    const code_purchase_order = order["code_purchase_order"];
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

    const safeFileName = code_purchase_order.replace(/\//g, '_'); // Mengganti '/' dengan '_'
    const outputPath = path.join(__dirname, '../public/file/order/', `${safeFileName}.pdf`);
    doc.pipe(fs.createWriteStream(outputPath));


    if (language === "zh") {
        const mandarinFontPath = path.join(__dirname, '../public/file/font/NotoSansSC-Regular.ttf');
        doc.font(mandarinFontPath);
    }

    // Header

    doc.fontSize(20).fillColor('#0665d0').text(messages.content.purchase_order.toUpperCase(), { align: 'right' })
    doc.fontSize(10).fillColor('black').text("#" + order.code_purchase_order.toUpperCase(), { align: 'right' })
    doc.moveDown(1);

    let marginleft = doc.page.margins.left; // Titik awal vertikal (y-axis)
    let margintop = doc.page.margins.top; // Titik awal vertikal (y-axis)
    let starttop = margintop + 60
    // Informasi Perusahaan (di kiri)
    doc.fontSize(12).text(order.log_partner.name.toUpperCase(), marginleft, starttop); // Posisi kiri
    // doc.fontSize(10).text(messages.content.address.toUpperCase() + ":", 30); // Tetap di kiri
    doc.fontSize(10).text(order.log_partner.address.toUpperCase(), marginleft, doc.y, { width: 200 });
    doc.fontSize(10).text(order.log_partner.city.toUpperCase(), marginleft, doc.y);
    doc.fontSize(10).text(order.log_partner.contact_person.toUpperCase(), 30, doc.y);
    doc.fontSize(10).text(order.log_partner.phone.toUpperCase(), marginleft, doc.y);
    doc.fontSize(10).text(order.log_partner.email, marginleft, doc.y);
    doc.moveDown(2);

    // // Informasi Partner (di kanan)
    // let rightX = 350; // Posisi horizontal (x-axis) untuk kolom kanan
    // doc.fontSize(12).text(quotation.log_partner.name.toUpperCase(), rightX, startY); // Posisi kanan
    // // doc.fontSize(10).text(messages.content.address.toUpperCase() + ":", rightX); // Tetap di kanan
    // doc.fontSize(10).text(quotation.log_partner.address.toUpperCase(), rightX, doc.y, { width: 200 });
    // doc.fontSize(10).text(quotation.log_partner.city.toUpperCase(), rightX, doc.y);
    // doc.fontSize(10).text(quotation.log_partner.contact_person.toUpperCase(), rightX, doc.y);
    // doc.fontSize(10).text(quotation.log_partner.phone, rightX, doc.y);
    // doc.moveDown(2);

    // // let y = startY + 50;
    // // Informasi Quotation
    // // doc.fontSize(10).text(`Quotation Code: ${quotation.code_purchase_request_quotation}`, 30,)
    // //     .text(`Request Date: ${quotation.date_request}`)
    // //     .text(`Delivery Date: ${quotation.date_delivery}`)
    // //     .text(`Currency: ${quotation.currency}`)
    // //     .text(`Payment Term: ${quotation.log_term_of_payment.log_term_of_payment_translation.translation}`)
    // //     .text(`Purchaser: ${quotation.employeePurchasing.fullname}`)
    // //     .moveDown();

    // // Detail Item Header

    let headertop = starttop + 100;
    let rowHeight = 20;
    let bgColor = '#0665d0';
    let textColor = 'white';
    doc.fontSize(10);
    doc.text(`${messages.content.purchase_request.toUpperCase()}` + ' #' + order.code_purchase_request, 30, headertop, { align: 'left' })
    doc.rect(30, headertop + 10, 20, rowHeight).fill(bgColor).fillColor(textColor).text(`#`, 30, headertop + 16, { width: 20, align: 'center' });
    doc.rect(50, headertop + 10, 271, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.description.toUpperCase()}`, 50, headertop + 16, { width: 271, align: 'center' });
    doc.rect(321, headertop + 10, 60, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.qty.toUpperCase()}`, 321, headertop + 16, { width: 60, align: 'center' });
    doc.rect(381, headertop + 10, 91, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.unit_price.toUpperCase()}`, 381, headertop + 16, { width: 91, align: 'center' });
    doc.rect(472, headertop + 10, 91, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.total.toUpperCase()}`, 472, headertop + 16, { width: 91, align: 'center' });


    // Detail Item
    let yBody = headertop + 35
    let counter = 1;
    order.details.forEach(item => {
        const total = item.qty * item.price;

        doc.fillColor('black')
        doc.text(counter, 30, yBody, { width: 20, align: 'center' })
        doc.text(item.log_item_master.name, 50, yBody, { width: 271, align: 'left' })
        doc.text(item.qty, 321, yBody, { width: 60, align: 'center' })
        doc.text(` ${item.price.toLocaleString()}`, 381, yBody, { width: 91, align: 'right' })
        doc.text(` ${total.toLocaleString()}`, 472, yBody, { width: 91, align: 'right' })
        const lineY = yBody + 12; // Posisi garis di bawah teks
        doc.strokeColor(bgColor).strokeOpacity(0.3).moveTo(30, lineY).lineTo(563, lineY).stroke();
        yBody += 17
        counter++;
    });

    doc.moveDown();
    const yFoot = yBody + 5;      // Titik awal vertikal
    const rowHeightFoot = 15;         // Tinggi baris
    const persen = (order.vat / (order.subtotal - order.discount + order.shipping_cost)) * 100
    const rows = [
        { label: `${messages.content.subtotal.toUpperCase()}:`, value: order.subtotal.toLocaleString() },
        { label: `${messages.content.discount.toUpperCase()}:`, value: order.discount.toLocaleString() },
        { label: `${messages.content.shipping_cost.toUpperCase()}:`, value: order.shipping_cost.toLocaleString() },
        { label: `${messages.content.vat.toUpperCase()} (${persen}%):`, value: order.vat.toLocaleString() },
        { label: `${messages.content.grand_total.toUpperCase()}:`, value: order.grand_total.toLocaleString() },
    ];

    rows.forEach((row, index) => {
        const y = yFoot + index * rowHeightFoot;
        doc.text(row.label, 360, y, { width: 110, align: 'right' });
        doc.text(row.value, 472, y, { width: 91, align: 'right' });
    });
    const yTOC = yBody + 5;
    doc.text(messages.content.terms_and_conditions.toUpperCase(), 30, yTOC, { width: 351, align: 'left' });
    doc.fontSize(8);

    // Fungsi untuk menambahkan teks dengan bullet point dan memperbarui yTOC secara dinamis
    const addBulletPoint = (label, value, bulletY) => {
        const text = `${label.toUpperCase()}: ${value}`; // Gabungkan label dan value
        const bulletWidth = doc.widthOfString('• ') + 6; // Lebar simbol bullet + jarak
        const textWidth = doc.widthOfString(text); // Lebar teks
        const textHeight = doc.heightOfString(text, { width: 340 }); // Hitung tinggi teks berdasarkan lebar maksimum

        // Tampilkan simbol bullet
        doc.text('•', 30, bulletY, { align: 'left' });

        // Tampilkan teks dengan jarak setelah bullet
        doc.text(text, 30 + bulletWidth, bulletY, { width: 320, align: 'left' });

        // Kembalikan posisi Y yang baru setelah menambahkan tinggi teks
        return bulletY + textHeight + 3; // Tambahkan padding 5 untuk spasi
    };

    // Menambahkan semua item dengan penyesuaian Y secara dinamis
    let dynamicYTOC = yTOC + 15;
    dynamicYTOC = addBulletPoint(messages.content.date_po, eppsLib.ddmmyyyy(order.date_delivery), dynamicYTOC);
    dynamicYTOC = addBulletPoint(messages.content.delivery_date, eppsLib.ddmmyyyy(order.date_delivery), dynamicYTOC);
    dynamicYTOC = addBulletPoint(messages.content.currency, order.currency.toUpperCase(), dynamicYTOC);
    dynamicYTOC = addBulletPoint(messages.content.term_of_payment, order.log_term_of_payment.log_term_of_payment_translation.translation.toUpperCase(), dynamicYTOC);
    dynamicYTOC = addBulletPoint(messages.content.receiving_locations, order.log_receiving_location.name.toUpperCase(), dynamicYTOC);
    dynamicYTOC = addBulletPoint(messages.content.note, order.note.toUpperCase(), dynamicYTOC);

    let approveTOC = dynamicYTOC + 15;
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

  
    doc.text(order.employeeApproval.fullname.toUpperCase(), 381, approveTOC + 130, { width: 182, align: 'center' })
    doc.end();

    res.status(200).json({
        access: "success",
        data: `${safeFileName}.pdf`,
    });
}

module.exports = controller;
