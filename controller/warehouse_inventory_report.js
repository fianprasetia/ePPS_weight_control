const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');
const ExcelJS = require('exceljs');
const controller = {}

controller.selectWarehouseInventoryReport = async function (req, res) {
    try {
        // Ambil isi file JSON dari req.file
        const jsonString = req.file.buffer.toString('utf8');
        const bodyParsed = JSON.parse(jsonString);

        const reqBody = bodyParsed["language_POST"] && bodyParsed["warehouse_inventory_POST"] ? bodyParsed : {}; // fallback untuk dukung struktur lama

        if (!reqBody) return res.status(400).json({ message: 'Data tidak ditemukan' });

        const language = reqBody["language_POST"];
        const warehouseInventory = reqBody["warehouse_inventory_POST"];

        // Baca file bahasa
        const jsonFilePath = path.join(__dirname, '../public/file/language.json');
        const data = await fsj.readFile(jsonFilePath, 'utf8');
        const translations = JSON.parse(data);

        const messages = translations.find(item => item.language === language);
        if (!messages) return res.status(400).json({ message: 'Bahasa tidak ditemukan' });

        const fileName = messages.content.warehouse_stock.toUpperCase();
        const outputPath = path.join(__dirname, '../public/file/warehouse', `${fileName}.xlsx`);

        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            filename: outputPath,
            useStyles: true,
            useSharedStrings: true
        });

        const worksheet = workbook.addWorksheet(messages.content.warehouse_stock.toUpperCase());

        worksheet.columns = [
            { header: messages.content.coa_code.toUpperCase(), key: 'code_coa', width: 20 },
            { header: messages.content.code_item.toUpperCase(), key: 'code_item', width: 20 },
            { header: messages.content.description.toUpperCase(), key: 'descriptions', width: 50 },
            { header: messages.content.uom.toUpperCase(), key: 'uom', width: 20 },
            { header: messages.content.opening_balance.toUpperCase(), key: 'opening_balance', width: 20 },
            { header: messages.content.in.toUpperCase(), key: 'in', width: 20 },
            { header: messages.content.out.toUpperCase(), key: 'out', width: 20 },
            { header: messages.content.end_balance.toUpperCase(), key: 'end_balance', width: 20 },
        ];

        warehouseInventory.forEach(item => {
            // const translation = (item.fat_coa_translations?.find(t => t.language_code === language)?.translation || '').toUpperCase();
            const endingQty = parseFloat(item.initial_qty) + parseFloat(item.incoming_qty) - parseFloat(item.outgoing_qty);
            worksheet.addRow({
                code_coa: item.log_item_master.log_item_category.code_coa,
                code_item: item.code_item,
                descriptions: item.log_item_master.name,
                uom: item.log_item_master.uom,
                opening_balance: item.beginning_price,
                in: item.incoming_price,
                out: item.outgoing_price,
                end_balance: endingQty,
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
