const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');
const ExcelJS = require('exceljs');
const controller = {}

controller.selectTrialBalanceReport = async function (req, res) {
    try {
        // Ambil isi file JSON dari req.file
        const jsonString = req.file.buffer.toString('utf8');
        const bodyParsed = JSON.parse(jsonString);

        const reqBody = bodyParsed["language_POST"] && bodyParsed["trial_balance_POST"] ? bodyParsed : {}; // fallback untuk dukung struktur lama

        if (!reqBody) return res.status(400).json({ message: 'Data tidak ditemukan' });

        const language = reqBody["language_POST"];
        const trialBalance = reqBody["trial_balance_POST"];
        // Baca file bahasa
        const jsonFilePath = path.join(__dirname, '../public/file/language.json');
        const data = await fsj.readFile(jsonFilePath, 'utf8');
        const translations = JSON.parse(data);

        const messages = translations.find(item => item.language === language);
        if (!messages) return res.status(400).json({ message: 'Bahasa tidak ditemukan' });

        const fileName = messages.content.trial_balance.toUpperCase();
        const outputPath = path.join(__dirname, '../public/file/trialbalance', `${fileName}.xlsx`);

        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            filename: outputPath,
            useStyles: true,
            useSharedStrings: true
        });

        const worksheet = workbook.addWorksheet(messages.content.trial_balance.toUpperCase());

        // Atur kolom
        worksheet.columns = [
            { header: messages.content.coa_code.toUpperCase(), key: 'code_code', width: 20 },
            { header: messages.content.description.toUpperCase(), key: 'descriptions', width: 50 },
            { header: messages.content.opening_balance.toUpperCase(), key: 'opening_balance', width: 20 },
            { header: messages.content.debit.toUpperCase(), key: 'debit', width: 20 },
            { header: messages.content.credit.toUpperCase(), key: 'credit', width: 20 },
            { header: messages.content.end_balance.toUpperCase(), key: 'end', width: 20 },
        ];

        // Inisialisasi total
        let totalOpening = 0;
        let totalDebit = 0;
        let totalCredit = 0;

        // Tambahkan data per baris
        trialBalance.forEach(item => {
            const endBalance = item.opening_balance + item.debit - item.credit;

            totalOpening += item.opening_balance;
            totalDebit += item.debit;
            totalCredit += item.credit;

            worksheet.addRow({
                code_code: item.code_code,
                descriptions: item.descriptions,
                opening_balance: item.opening_balance,
                debit: item.debit,
                credit: item.credit,
                end: endBalance,
            }).commit();
        });

        // Tambahkan baris total (footer)
        const totalEnd = totalOpening + totalDebit - totalCredit;

        const totalRow = worksheet.addRow({
            code_code: '',
            descriptions: messages.content.total.toUpperCase(),
            opening_balance: totalOpening,
            debit: totalDebit,
            credit: totalCredit,
            end: totalEnd,
        });

        // Bold untuk baris total
        totalRow.font = { bold: true };

        await workbook.commit(); // finalize stream writer


        console.log(`File disimpan di: ${outputPath}`);
        res.status(200).json({
            access: "success",
            data: `${fileName}.xlsx`,
        });

    } catch (error) {
        console.error('Gagal ekspor:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat ekspor Excel.' });
    }
};


module.exports = controller;
