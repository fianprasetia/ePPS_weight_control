const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');
const ExcelJS = require('exceljs');
const eppsLib = require('./epps');
const controller = {}

controller.selectComparison = async function (req, res) {
    try {

        const jsonString = req.file.buffer.toString('utf8');
        const bodyParsed = JSON.parse(jsonString);

        const reqBody = bodyParsed["language_POST"] && bodyParsed["purchase_comparison_POST"] ? bodyParsed : {};

        if (!reqBody) return res.status(400).json({ message: 'Data tidak ditemukan' });

        const language = reqBody["language_POST"];
        const comparisonSheet = reqBody["purchase_comparison_POST"];
        const dataPR = comparisonSheet["selectPurchaseRequestData"]
        const dataPRQ = comparisonSheet["dataQuotation"]
        const noPR = dataPR[0]["code_purchase_request"]
        const safeFileName = noPR.replace(/\//g, '_');
        const jsonFilePath = path.join(__dirname, "../public/file/language.json");
        const data = await fsj.readFile(jsonFilePath, "utf8");
        const translations = JSON.parse(data);
        const messages = translations.find((item) => item.language === language);
        if (!messages) return res.status(400).json({ message: "Bahasa tidak ditemukan" });

        const fileName = messages.content.comparison_sheet.toUpperCase() + " " + safeFileName;
        const outputPath = path.join(__dirname, "../public/file/comparison", `${fileName}.xlsx`);
        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            filename: outputPath,
            useStyles: true,
            useSharedStrings: true
        });
        const worksheet = workbook.addWorksheet(messages.content.comparison_sheet.toUpperCase());

        const columns = [{ header: "", key: "col0", width: 50 }];



        dataPRQ.forEach((quotation, idx) => {
            columns.push(
                { header: "", key: `vendor_${idx + 1}_qty`, width: 10 },
                { header: "", key: `vendor_${idx + 1}_price`, width: 20 },
                { header: "", key: `vendor_${idx + 1}_total`, width: 20 }
            );
        });

        worksheet.columns = columns;


        const rowPR = { col0: messages.content.purchase_request.toUpperCase() };
        rowPR[`vendor_1_qty`] = noPR;
        const prRow = worksheet.addRow(rowPR);
        prRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
        });

        const rowQuotation = { col0: messages.content.purchase_request_quotation.toUpperCase() };
        dataPRQ.forEach((q, idx) => {
            rowQuotation[`vendor_${idx + 1}_qty`] = q.code_purchase_request_quotation;
        });
        const quotationRow = worksheet.addRow(rowQuotation);
        dataPRQ.forEach((_, idx) => {
            const startCol = 2 + (idx * 3);
            const endCol = startCol + 2;
            const rowNumber = quotationRow.number;
            worksheet.mergeCells(rowNumber, startCol, rowNumber, endCol);
            const cell = worksheet.getCell(rowNumber, startCol);
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.font = { bold: true };
        });


        const rowVendor = { col0: messages.content.partners.toUpperCase() };
        dataPRQ.forEach((q, idx) => {
            rowVendor[`vendor_${idx + 1}_qty`] = q.log_partner.name.toUpperCase();
        });
        // worksheet.addRow(rowVendor);
        const vendorRow = worksheet.addRow(rowVendor);
        dataPRQ.forEach((_, idx) => {
            const startCol = 2 + (idx * 3);
            const endCol = startCol + 2;
            const rowNumber = vendorRow.number;
            worksheet.mergeCells(rowNumber, startCol, rowNumber, endCol);
            const cell = worksheet.getCell(rowNumber, startCol);
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.font = { bold: true };
        });


        const rowHeader = { col0: "" };
        dataPRQ.forEach((_, idx) => {
            rowHeader[`vendor_${idx + 1}_qty`] = messages.content.qty.toUpperCase();
            rowHeader[`vendor_${idx + 1}_price`] = messages.content.unit_price.toUpperCase()
            rowHeader[`vendor_${idx + 1}_total`] = messages.content.total.toUpperCase();
        });
        const headerRow = worksheet.addRow(rowHeader);
        headerRow.eachCell((cell, colNumber) => {
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.font = { bold: true }; // opsional, biar tebal
            // cell.border = {
            //     top: { style: "thin" },
            //     left: { style: "thin" },
            //     bottom: { style: "thin" },
            //     right: { style: "thin" },
            // }; // opsional, biar rapih
        });

        dataPR.forEach((item) => {
            const rowItem = { col0: item.log_item_master.name.toUpperCase() };

            dataPRQ.forEach((quotation, idx) => {
                const detail = quotation.details?.find(
                    (d) => d.code_item === item.code_item
                );
                const qty = detail?.qty || 0;
                const price = detail?.price || 0;
                const total = qty * price;

                rowItem[`vendor_${idx + 1}_qty`] = qty;
                rowItem[`vendor_${idx + 1}_price`] = eppsLib.formatRupiah(price);
                rowItem[`vendor_${idx + 1}_total`] = eppsLib.formatRupiah(total);
            });

            const itemRow = worksheet.addRow(rowItem);

            dataPRQ.forEach((_, idx) => {
                const colQty = 2 + (idx * 3);
                const colPrice = colQty + 1;
                const colTotal = colQty + 2;
                const rowNumber = itemRow.number;

                worksheet.getCell(rowNumber, colQty).alignment = {
                    horizontal: "center",
                    vertical: "middle",
                };

                worksheet.getCell(rowNumber, colPrice).alignment = {
                    horizontal: "right",
                    vertical: "middle",
                };

                worksheet.getCell(rowNumber, colTotal).alignment = {
                    horizontal: "right",
                    vertical: "middle",
                };
            });
        });
        const rowEmpty1 = { col0: "" };
        worksheet.addRow(rowEmpty1);

        const rowSubtotal = { col0: messages.content.subtotal.toUpperCase() };
        dataPRQ.forEach((q, idx) => {
            rowSubtotal[`vendor_${idx + 1}_total`] = eppsLib.formatRupiah(q.subtotal);
        });
        const subtotalRow = worksheet.addRow(rowSubtotal);
        dataPRQ.forEach((_, idx) => {
            const col = 2 + (idx * 3);
            const colsubTotal = col + 2;
            const rowNumber = subtotalRow.number;

            worksheet.getCell(rowNumber, colsubTotal).alignment = {
                horizontal: "right",
                vertical: "middle",
            };
        });

        const rowDiscount = { col0: messages.content.discount.toUpperCase() };
        dataPRQ.forEach((q, idx) => {
            rowDiscount[`vendor_${idx + 1}_total`] = eppsLib.formatRupiah(q.discount);
        });
        const discountRow = worksheet.addRow(rowDiscount);
        dataPRQ.forEach((_, idx) => {
            const col = 2 + (idx * 3);
            const colDiscount = col + 2;
            const rowNumber = discountRow.number;

            worksheet.getCell(rowNumber, colDiscount).alignment = {
                horizontal: "right",
                vertical: "middle",
            };
        });

        const rowAddCost = { col0: messages.content.shipping_cost.toUpperCase() };
        dataPRQ.forEach((q, idx) => {
            rowAddCost[`vendor_${idx + 1}_total`] = eppsLib.formatRupiah(q.shipping_cost);
        });
        const addCostRow = worksheet.addRow(rowAddCost);
        dataPRQ.forEach((_, idx) => {
            const col = 2 + (idx * 3);
            const colAddCost = col + 2;
            const rowNumber = addCostRow.number;

            worksheet.getCell(rowNumber, colAddCost).alignment = {
                horizontal: "right",
                vertical: "middle",
            };
        });

        var rowVat = ""
        dataPRQ.forEach((item) => {
            const persen = (item.vat / (item.subtotal - item.discount + item.shipping_cost)) * 100
            rowVat = { col0: `${messages.content.vat.toUpperCase()} (${persen}%)` };
        });
        dataPRQ.forEach((q, idx) => {
            rowVat[`vendor_${idx + 1}_total`] = eppsLib.formatRupiah(q.vat);
        });
        const itemRow = worksheet.addRow(rowVat);
        dataPRQ.forEach((_, idx) => {
            const col = 2 + (idx * 3);
            const colVat = col + 2;
            const rowNumber = itemRow.number;

            worksheet.getCell(rowNumber, colVat).alignment = {
                horizontal: "right",
                vertical: "middle",
            };
        });

        const rowGrandTotal= { col0: messages.content.grand_total.toUpperCase() };
        dataPRQ.forEach((q, idx) => {
            rowGrandTotal[`vendor_${idx + 1}_total`] = eppsLib.formatRupiah(q.grand_total);
        });
        const gradnTotalRow = worksheet.addRow(rowGrandTotal);
        dataPRQ.forEach((_, idx) => {
            const col = 2 + (idx * 3);
            const colGrandTotal = col + 2;
            const rowNumber = gradnTotalRow.number;

            worksheet.getCell(rowNumber, colGrandTotal).alignment = {
                horizontal: "right",
                vertical: "middle",
            };
        });

        await worksheet.commit();
        await workbook.commit();








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
