const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');
const ExcelJS = require('exceljs');
const controller = {}

controller.selectMasterAccountsReport = async function (req, res) {
    try {
        // Ambil isi file JSON dari req.file
        const jsonString = req.file.buffer.toString('utf8');
        const bodyParsed = JSON.parse(jsonString);

        const reqBody = bodyParsed["language_POST"] && bodyParsed["master_account_POST"] ? bodyParsed : {}; // fallback untuk dukung struktur lama

        if (!reqBody) return res.status(400).json({ message: 'Data tidak ditemukan' });

        const language = reqBody["language_POST"];
        const masterAccounts = reqBody["master_account_POST"];

        // Baca file bahasa
        const jsonFilePath = path.join(__dirname, '../public/file/language.json');
        const data = await fsj.readFile(jsonFilePath, 'utf8');
        const translations = JSON.parse(data);

        const messages = translations.find(item => item.language === language);
        if (!messages) return res.status(400).json({ message: 'Bahasa tidak ditemukan' });

        const fileName = messages.content.master_coa.toUpperCase();
        const outputPath = path.join(__dirname, '../public/file/coa', `${fileName}.xlsx`);

        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            filename: outputPath,
            useStyles: true,
            useSharedStrings: true
        });

        const worksheet = workbook.addWorksheet(messages.content.master_coa.toUpperCase());

        worksheet.columns = [
            { header: messages.content.coa_code.toUpperCase(), key: 'code_coa', width: 20 },
            { header: messages.content.description.toUpperCase(), key: 'descriptions_coa', width: 50 },
            { header: messages.content.level.toUpperCase(), key: 'level_coa', width: 20 },
            { header: messages.content.type.toUpperCase(), key: 'type_coa', width: 20 },
            { header: messages.content.entity.toUpperCase(), key: 'entity_coa', width: 20 },
            { header: messages.content.status.toUpperCase(), key: 'status_coa', width: 20 },
        ];

        masterAccounts.forEach(item => {
            const translation = (item.fat_coa_translations?.find(t => t.language_code === language)?.translation || '').toUpperCase();
            worksheet.addRow({
                code_coa: item.code_coa,
                descriptions_coa: translation,
                level_coa: item.level_coa,
                type_coa: item.type_coa,
                entity_coa: item.entity_coa,
                status_coa: item.status_coa === 1 ? messages.content.active.toUpperCase() : messages.content.nonactive.toUpperCase(),
            }).commit();
        });

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
