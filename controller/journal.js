const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');
const ExcelJS = require('exceljs');
const { time } = require('console');
const eppsLib = require('./epps');
const controller = {}

controller.selectJournal = async function (req, res) {
    try {
        // Ambil isi file JSON dari req.file
        const jsonString = req.file.buffer.toString('utf8');
        const bodyParsed = JSON.parse(jsonString);
        const reqBody = bodyParsed["language_POST"] && bodyParsed["journal_POST"] ? bodyParsed : {};  // fallback untuk dukung struktur lama

        if (!reqBody) return res.status(400).json({ message: 'Data tidak ditemukan' });

        const language = reqBody["language_POST"];
        const journal = reqBody["journal_POST"];
        // Baca file bahasa
        const jsonFilePath = path.join(__dirname, '../public/file/language.json');
        const data = await fsj.readFile(jsonFilePath, 'utf8');
        const translations = JSON.parse(data);

        const messages = translations.find(item => item.language === language);
        if (!messages) return res.status(400).json({ message: 'Bahasa tidak ditemukan' });

        const fileName = messages.content.journal.toUpperCase();
        const outputPath = path.join(__dirname, '../public/file/journal', `${fileName}.xlsx`);

        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            filename: outputPath,
            useStyles: true,
            useSharedStrings: true
        });

        const worksheet = workbook.addWorksheet(messages.content.journal.toUpperCase());

        // Atur kolom
        worksheet.columns = [
            { header: messages.content.journal_code.toUpperCase(), key: 'code_journal', width: 20 },
            { header: messages.content.date.toUpperCase(), key: 'date', width: 20 },
            { header: messages.content.worksite.toUpperCase(), key: 'worksite', width: 20 },
            { header: messages.content.coa_code.toUpperCase(), key: 'code_coa', width: 20 },
            { header: messages.content.sequence_number.toUpperCase(), key: 'sequence_number', width: 20 },
            { header: messages.content.debit.toUpperCase(), key: 'debit', width: 20 },
            { header: messages.content.credit.toUpperCase(), key: 'credit', width: 20 },
            { header: messages.content.reference_code.toUpperCase(), key: 'reference_code', width: 50 },
            { header: messages.content.description.toUpperCase(), key: 'description', width: 50 },
            { header: messages.content.code_partners.toUpperCase(), key: 'code_partners', width: 20 },
            { header: messages.content.code_item.toUpperCase(), key: 'code_item', width: 20 },
        ];

        // Inisialisasi total
        let totalDebit = 0;
        let totalCredit = 0;

        // Tambahkan data per baris
        journal.forEach(item => {
            const debitAmount = item.dk_code === 'D' ? item.amount : 0;
            const creditAmount = item.dk_code === 'C' ? item.amount : 0;

            totalDebit += debitAmount;
            totalCredit += creditAmount;

            worksheet.addRow({
                code_journal: item.code_journal,
                date: eppsLib.ddmmyyyy(item.date),
                worksite: item.worksite,
                code_coa: item.code_coa,
                sequence_number: item.sequence_number,
                debit: debitAmount,
                credit: creditAmount,
                reference_code: item.reference_code,
                description: item.description,
                code_partners: item.code_partners,
                code_item: item.code_item,
            }).commit();
        });

        // Tambahkan baris total (footer)
        // const totalEnd = totalOpening + totalDebit - totalCredit;

        const totalRow = worksheet.addRow({
            code_journal: '',
            date: '',
            worksite: '',
            code_coa: '',
            sequence_number: messages.content.total.toUpperCase(),
            debit: totalDebit,
            credit: totalCredit,
            reference_code: '',
            description: '',
            code_partners: '',
            code_item: '',
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
