const PDFDocument = require('pdfkit');
const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');
const eppsLib = require('./epps');
const controller = {};

controller.selectPurchaseRequestQuotation = async function (req, res) {
    const dataPurchaseRequestQuotation = req.body["dataPurchaseRequestQuotationPdf"][0]["purchase_request_quotation_POST"];

    const jsonFilePath = path.join(__dirname, '../public/file/language.json');
    const data = await fsj.readFile(jsonFilePath, 'utf8');
    const translations = JSON.parse(data);

    const language = req.body["dataPurchaseRequestQuotationPdf"][0]["language_POST"];
    const messages = translations.find(item => item.language === language);

    const quotation = dataPurchaseRequestQuotation[0];
    const code_purchase_request_quotation = quotation["code_purchase_request_quotation"];

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
    // const outputPath = path.join(__dirname, '../public/file/quotation', `${code_purchase_request_quotation}.pdf`);
    // doc.pipe(fs.createWriteStream(outputPath));

    const safeFileName = code_purchase_request_quotation.replace(/\//g, '_'); // Mengganti '/' dengan '_'
    const outputPath = path.join(__dirname, '../public/file/quotation', `${safeFileName}.pdf`);
    doc.pipe(fs.createWriteStream(outputPath));


    if (language === "zh") {
        const mandarinFontPath = path.join(__dirname, '../public/file/font/NotoSansSC-Regular.ttf');
        doc.font(mandarinFontPath);
    }

    // Header

    doc.fontSize(20).fillColor('#0665d0').text(messages.content.quotation.toUpperCase(), { align: 'right' })
    doc.fontSize(10).fillColor('black').text("#" + quotation.code_purchase_request_quotation.toUpperCase(), { align: 'right' })
    doc.moveDown(1);

    let startY = 100; // Titik awal vertikal (y-axis)

    // Informasi Perusahaan (di kiri)
    doc.fontSize(12).text(quotation.adm_company.name.toUpperCase(), 30, startY); // Posisi kiri
    // doc.fontSize(10).text(messages.content.address.toUpperCase() + ":", 30); // Tetap di kiri
    doc.fontSize(10).text(quotation.adm_company.address.toUpperCase(), 30, doc.y, { width: 200 });
    doc.fontSize(10).text(quotation.adm_company.city.toUpperCase(), 30, doc.y);
    doc.moveDown(2);

    // Informasi Partner (di kanan)
    let rightX = 350; // Posisi horizontal (x-axis) untuk kolom kanan
    doc.fontSize(12).text(quotation.log_partner.name.toUpperCase(), rightX, startY); // Posisi kanan
    // doc.fontSize(10).text(messages.content.address.toUpperCase() + ":", rightX); // Tetap di kanan
    doc.fontSize(10).text(quotation.log_partner.address.toUpperCase(), rightX, doc.y, { width: 200 });
    doc.fontSize(10).text(quotation.log_partner.city.toUpperCase(), rightX, doc.y);
    doc.fontSize(10).text(quotation.log_partner.contact_person.toUpperCase(), rightX, doc.y);
    doc.fontSize(10).text(quotation.log_partner.phone, rightX, doc.y);
    doc.moveDown(2);

    // let y = startY + 50;
    // Informasi Quotation
    // doc.fontSize(10).text(`Quotation Code: ${quotation.code_purchase_request_quotation}`, 30,)
    //     .text(`Request Date: ${quotation.date_request}`)
    //     .text(`Delivery Date: ${quotation.date_delivery}`)
    //     .text(`Currency: ${quotation.currency}`)
    //     .text(`Payment Term: ${quotation.log_term_of_payment.log_term_of_payment_translation.translation}`)
    //     .text(`Purchaser: ${quotation.employeePurchasing.fullname}`)
    //     .moveDown();

    // Detail Item Header

    let yHeader = 190;
    let rowHeight = 20;
    let bgColor = '#0665d0';
    let textColor = 'white';
    doc.fontSize(10);
    doc.text(`${messages.content.purchase_request.toUpperCase()}`+' #'+ quotation.code_purchase_request, 30, yHeader, { align: 'left' })
    doc.rect(30, yHeader + 10, 20, rowHeight).fill(bgColor).fillColor(textColor).text(`#`, 30, yHeader + 16, { width: 20, align: 'center' });
    doc.rect(50, yHeader + 10, 271, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.description.toUpperCase()}`, 50, yHeader + 16, { width: 271, align: 'center' });
    doc.rect(321, yHeader + 10, 60, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.qty.toUpperCase()}`, 321, yHeader + 16, { width: 60, align: 'center' });
    doc.rect(381, yHeader + 10, 91, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.unit_price.toUpperCase()}`, 381, yHeader + 16, { width: 91, align: 'center' });
    doc.rect(472, yHeader + 10, 91, rowHeight).fill(bgColor).fillColor(textColor).text(`${messages.content.total.toUpperCase()}`, 472, yHeader + 16, { width: 91, align: 'center' });


    // Detail Item
    let yBody = yHeader + 35
    let counter = 1;
    quotation.details.forEach(item => {
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
    const persen = (quotation.vat / (quotation.subtotal - quotation.discount + quotation.shipping_cost)) * 100
    const rows = [
        { label: `${messages.content.subtotal.toUpperCase()}:`, value: quotation.subtotal.toLocaleString() },
        { label: `${messages.content.discount.toUpperCase()}:`, value: quotation.discount.toLocaleString() },
        { label: `${messages.content.shipping_cost.toUpperCase()}:`, value: quotation.shipping_cost.toLocaleString() },
        { label: `${messages.content.vat.toUpperCase()} (${persen}%):`, value: quotation.vat.toLocaleString() },
        { label: `${messages.content.grand_total.toUpperCase()}:`, value: quotation.grand_total.toLocaleString() },
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
    dynamicYTOC = addBulletPoint(messages.content.order_date, eppsLib.ddmmyyyy(quotation.date_request), dynamicYTOC);
    dynamicYTOC = addBulletPoint(messages.content.delivery_date, eppsLib.ddmmyyyy(quotation.date_delivery), dynamicYTOC);
    dynamicYTOC = addBulletPoint(messages.content.currency, quotation.currency.toUpperCase(), dynamicYTOC);
    // dynamicYTOC = addBulletPoint(messages.content.exchange_rate, quotation.exchange_rate, dynamicYTOC);
    dynamicYTOC = addBulletPoint(messages.content.term_of_payment, quotation.log_term_of_payment.log_term_of_payment_translation.translation.toUpperCase(), dynamicYTOC);
    dynamicYTOC = addBulletPoint(messages.content.receiving_locations, quotation.log_receiving_location.name.toUpperCase(), dynamicYTOC);
    dynamicYTOC = addBulletPoint(messages.content.note, quotation.note.toUpperCase(), dynamicYTOC);

    // doc.text(bulletText('•', `${messages.content.order_date.toUpperCase()}`, eppsLib.ddmmyyyy(quotation.date_request)));
    // doc.text(bulletText('•', `${messages.content.delivery_date.toUpperCase()}`, eppsLib.ddmmyyyy(quotation.date_delivery)));
    // doc.text(bulletText('•', `${messages.content.currency.toUpperCase()}`, quotation.currency.toUpperCase()));
    // doc.text(bulletText('•', `${messages.content.exchange_rate.toUpperCase()}`, quotation.exchange_rate));
    // doc.text(bulletText('•', `${messages.content.term_of_payment.toUpperCase()}`, quotation.log_term_of_payment.log_term_of_payment_translation.translation.toUpperCase()), { width: 351, align: 'left' });
    // doc.text(bulletText('•', `${messages.content.receiving_locations.toUpperCase()}`, quotation.log_receiving_location.name.toUpperCase()), { width: 351, align: 'left' });
    // doc.text(bulletText('•', `${messages.content.note.toUpperCase()}`, quotation.note.toUpperCase()), { width: 351, align: 'left' });

    doc.end();

    res.status(200).json({
        access: "success",
        data: `${safeFileName}.pdf`,
    });
}

module.exports = controller;
