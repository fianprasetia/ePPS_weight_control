const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');
const ExcelJS = require('exceljs');
const controller = {}

controller.selectWarehouseInventoryValueReport = async function (req, res) {
    try {
        // Ambil isi file JSON dari req.file
        const jsonString = req.file.buffer.toString('utf8');
        const bodyParsed = JSON.parse(jsonString);

        const reqBody = bodyParsed["language_POST"] && bodyParsed["warehouse_inventory_value_POST"] ? bodyParsed : {}; // fallback untuk dukung struktur lama

        if (!reqBody) return res.status(400).json({ message: 'Data tidak ditemukan' });

        const language = reqBody["language_POST"];
        const warehouseInventory = reqBody["warehouse_inventory_value_POST"];

        // Baca file bahasa
        const jsonFilePath = path.join(__dirname, '../public/file/language.json');
        const data = await fsj.readFile(jsonFilePath, 'utf8');
        const translations = JSON.parse(data);

        const messages = translations.find(item => item.language === language);
        if (!messages) return res.status(400).json({ message: 'Bahasa tidak ditemukan' });

        const fileName = messages.content.warehouse_value.toUpperCase();
        const outputPath = path.join(__dirname, '../public/file/warehouse', `${fileName}.xlsx`);

        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            filename: outputPath,
            useStyles: true,
            useSharedStrings: true
        });

        const worksheet = workbook.addWorksheet(messages.content.warehouse_value.toUpperCase());

        worksheet.mergeCells('A1:A2'); // kode COA
        worksheet.getCell('A1').value = messages.content.coa_code.toUpperCase();
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('B1:B2'); // kode barang
        worksheet.getCell('B1').value = messages.content.code_item.toUpperCase();
        worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('C1:C2'); // descriptions
        worksheet.getCell('C1').value = messages.content.description.toUpperCase();
        worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('D1:D2'); // uom
        worksheet.getCell('D1').value = messages.content.uom.toUpperCase();
        worksheet.getCell('D1').alignment = { vertical: 'middle', horizontal: 'center' };

        // SALDO AWAL
        worksheet.mergeCells('E1:G1');
        worksheet.getCell('E1').value = messages.content.opening_balance.toUpperCase();
        worksheet.getCell('E1').alignment = { horizontal: 'center' };

        // IN
        worksheet.mergeCells('H1:J1');
        worksheet.getCell('H1').value = messages.content.in.toUpperCase();
        worksheet.getCell('H1').alignment = { horizontal: 'center' };

        // OUT
        worksheet.mergeCells('K1:M1');
        worksheet.getCell('K1').value = messages.content.out.toUpperCase();
        worksheet.getCell('K1').alignment = { horizontal: 'center' };

        // SALDO AKHIR
        worksheet.mergeCells('N1:P1');
        worksheet.getCell('N1').value = messages.content.end_balance.toUpperCase();
        worksheet.getCell('N1').alignment = { horizontal: 'center' };

        // Baris kedua (qty, unit price, total price)
        const row2 = worksheet.getRow(2);
        [
            'QTY', 'UNIT PRICE', 'TOTAL PRICE',
            'QTY', 'UNIT PRICE', 'TOTAL PRICE',
            'QTY', 'UNIT PRICE', 'TOTAL PRICE',
            'QTY', 'UNIT PRICE', 'TOTAL PRICE'
        ].forEach((val, idx) => {
            row2.getCell(idx + 5).value = val; // dimulai dari kolom E (index ke-5)
            row2.getCell(idx + 5).alignment = { horizontal: 'center' };
        });


        worksheet.columns = [
            { key: 'code_coa', width: 20 },
            { key: 'code_item', width: 20 },
            { key: 'descriptions', width: 50 },
            { key: 'uom', width: 10 },
            { key: 'qty_opening', width: 15 },
            { key: 'unit_price_opening', width: 15 },
            { key: 'total_price_opening', width: 20 },
            { key: 'qty_in', width: 15 },
            { key: 'unit_price_in', width: 15 },
            { key: 'total_price_in', width: 20 },
            { key: 'qty_out', width: 15 },
            { key: 'unit_price_out', width: 15 },
            { key: 'total_price_out', width: 20 },
            { key: 'qty_ending', width: 15 },
            { key: 'unit_price_ending', width: 15 },
            { key: 'total_price_ending', width: 20 },
        ];


        warehouseInventory.forEach((item, idx) => {
            const begTotal = +item.initial_qty * +item.beginning_price;
            const inTotal = +item.incoming_qty * +item.incoming_price;
            const outTotal = +item.outgoing_qty * +item.outgoing_price;
            const endQty = +item.initial_qty + +item.incoming_qty - +item.outgoing_qty;
            const endTotal = endQty * +item.outgoing_price;

            worksheet.addRow({
                code_coa: item.log_item_master.log_item_category.code_coa,
                code_item: item.code_item,
                descriptions: item.log_item_master.name,
                uom: item.log_item_master.uom,

                qty_opening: item.initial_qty,
                unit_price_opening: item.beginning_price,
                total_price_opening: begTotal,

                qty_in: item.incoming_qty,
                unit_price_in: item.incoming_price,
                total_price_in: inTotal,

                qty_out: item.outgoing_qty,
                unit_price_out: item.outgoing_price,
                total_price_out: outTotal,

                qty_ending: endQty,
                unit_price_ending: item.outgoing_price,
                total_price_ending: endTotal,
            }).commit();
        });

        const totals = warehouseInventory.reduce((acc, item) => {
            acc.begin += +item.initial_qty * +item.beginning_price;
            acc.in += +item.incoming_qty * +item.incoming_price;
            acc.out += +item.outgoing_qty * +item.outgoing_price;
            acc.end += (+item.initial_qty + +item.incoming_qty - +item.outgoing_qty) * +item.outgoing_price;
            return acc;
        }, { begin: 0, in: 0, out: 0, end: 0 });

        const totalRow = worksheet.addRow({
            descriptions: 'TOTAL',
            total_price_opening: totals.begin,
            total_price_in: totals.in,
            total_price_out: totals.out,
            total_price_ending: totals.end,
        });
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
