const PDFDocument = require('pdfkit');
const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');
// const messages = require("../public/file/language.json");
const controller = {}

controller.selectAssignReport = async function (req, res) {
    const { attendanceData } = req.body["dataAttendancePdf"][0];
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="attendance_report.pdf"');

    const jsonFilePath = path.join(__dirname, '../public/file/language.json');
    const data = await fsj.readFile(jsonFilePath, 'utf8');
    const translations = JSON.parse(data);
    const language = req.body["dataAttendancePdf"][0]["language_POST"]
    const messages = translations.find(item => item.language === language);
    const companyCode = req.body["dataAttendancePdf"][0]["employeeCode_POST"]
    const startDate = req.body["dataAttendancePdf"][0]["startDate_POST"]
    const endDate = req.body["dataAttendancePdf"][0]["endDate_POST"]
    const doc = new PDFDocument({ size: 'A4' });
    const outputPath = path.join(__dirname, '../public/file/attendance', `${messages.content.assign_employee_report.toUpperCase()} ${companyCode}.pdf`);
    doc.pipe(fs.createWriteStream(outputPath));
    if (language === "zh") {
        mandarinFontPath = path.join(__dirname, '../public/file/font/NotoSansSC-Regular.ttf');
        doc.font(mandarinFontPath);
    }
    // Loop berdasarkan setiap pegawai
    const groupedData = groupBy(attendanceData, 'fullname');
    Object.keys(groupedData).forEach((fullname, index) => {
        if (index > 0) doc.addPage(); // Tambahkan halaman baru jika bukan halaman pertama

        const employeeData = groupedData[fullname];

        // Header
        doc.fontSize(16).text(`${messages.content.assign_employee_report.toUpperCase()} ${companyCode}`, { align: "center" },);
        doc.moveDown(1);
        doc.fontSize(10).text(`${messages.content.name.toUpperCase()}: ${fullname}`, 25, 100);
        doc.fontSize(10).text(`${messages.content.peroid.toUpperCase()}: ${startDate} - ${endDate} `);
        // doc.moveDown(1);
        doc.moveTo(25, 125).lineTo(580, 125).stroke();

        // Table Header
        let yH = 130;
        doc.fontSize(8);
        doc.text(`${messages.content.date.toUpperCase()}`, 25, yH, { width: 60 });
        doc.text(`${messages.content.on_duty.toUpperCase()}`, 99, yH, { width: 60 });
        doc.text(`${messages.content.off_duty.toUpperCase()}`, 173, yH, { width: 60 });
        doc.text(`${messages.content.checkin.toUpperCase()}`, 247, yH, { width: 60 });
        doc.text(`${messages.content.checkout.toUpperCase()}`, 321, yH, { width: 60 });
        doc.text(`${messages.content.late_tolerance.toUpperCase()}`, 395, yH, { width: 60 });
        doc.text(`${messages.content.leave_early_time.toUpperCase()}`, 469, yH, { width: 60 });
        doc.text(`${messages.content.over_time.toUpperCase()}`, 540, yH, { width: 60 });
        let yLine = doc.y + 20;
        doc.moveTo(25, yLine).lineTo(580, yLine).stroke();
        // Table Content
        let y = yLine + 5;
        employeeData.forEach((record) => {
            doc.fontSize(8)
                .text(record.date, 25, y)
                .text(record.onDuty || '-', 99, y)
                .text(record.offDuty || '-', 173, y)
                .text(record.checkIn || '-', 247, y)
                .text(record.checkOut || '-', 321, y)
                .text(record.lateWork || '-', 395, y)
                .text(record.earlyWork || '-', 469, y)
                .text(record.over || '-', 540, y);

            y += 17; // Jarak antar baris
        });
    });

    // End and save the PDF document
    doc.end();
    res.status(200).json({
        access: "success",
        // message: messages[language]?.insertData,
        data: `${messages.content.assign_employee_report.toUpperCase()} ${companyCode}.pdf`,
    });
    // console.log('PDF generated successfully.');
}

// Fungsi untuk mengelompokkan data berdasarkan nama
function groupBy(array, key) {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {});
}

module.exports = controller;
