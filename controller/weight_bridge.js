const model = require("../models/index");
const koneksi = require("../config/database");
const messages = require("./message");
const sequelize = require('sequelize');
const { Op } = require("sequelize");
const logger = require('./logger');
const responseHelper = require('../helpers/responseHelper');

const controller = {};

controller.selectWeighBridge = async function (req, res) {
    try {
        const requestData = req.body;
        const { language_POST: language } = requestData;

        const selectWeighBridgeData = await selectWeighBridge();
        if (selectWeighBridgeData.length === 0) {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }

        return responseHelper.success(res, messages[language]?.successfulData, selectWeighBridgeData);

        async function selectWeighBridge() {
            return await model.mll_weigh_bridge.findAll({
                include: [
                    {
                        attributes: ["fullname"],
                        model: model.adm_employee,
                    },
                ],
                where: {
                    status: 1
                },
                order: [
                    ['ticket_no', 'ASC'],
                ],
            });
        }
    } catch (error) {
        return responseHelper.error(res, error);
    }
};
controller.insertWeightBridge = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const requestData = req.body[0];
        const {
            language_POST: language,
            employeeID_POST: employeeID,
            estate_POST: estate,
            division_POST: division,
            driver_POST: driver,
            delivery_POST: delivery,
            totalBunches_POST: totalBunches,
            looseFruit_POST: looseFruit,
            plantingYear_POST: plantingYear,
            note_POST: note,
            weightIn_POST: weightIn,
            dateIn_POST: dateIn,
            noVehicle_POST: noVehicle,
            source_POST: source,
            detailBlock: detailBlock,
        } = requestData;
        const [date, time] = dateIn.split(' ');
        const [day, month, year] = date.split('-');
        const formattedDate = `${year}`;
        const resultDateTime = `${year}-${month}-${day} ${time}`;
        const codeBlockList = detailBlock.map((item) => item.code_block_POST).join(',');

        const selectWeightControlData = await selectWeightControl();
        if (selectWeightControlData.length === 0) {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }

        const newCode = await generateNewCode(selectWeightControlData);
        const insertWeighBridgeData = await insertWeighBridge(selectWeightControlData);
        if (!insertWeighBridgeData) {
            return responseHelper.Unsuccessful(res, messages[language]?.failedData);
        }
        await transaction.commit();
        return responseHelper.success(res, messages[language]?.insertData, insertWeighBridgeData);

        async function selectWeightControl() {
            return await model.mll_weight_control.findAll({
                attributes: ["weight_control_code", "code_company", "code_mill"],
                transaction,
            });
        }
        async function generateNewCode(selectWeightControlData) {
            const codeWC = selectWeightControlData[0].weight_control_code;
            const existingIssues = await model.mll_weigh_bridge.findAll({
                where: {
                    [Op.and]: [
                        { code_item: 401000003 },
                        {
                            ticket_no: {
                                [Op.like]: `TBS${codeWC}${formattedDate}%`
                            }
                        }
                    ],
                },
                transaction,
            });
            let sequenceNumber;
            if (existingIssues.length > 0) {
                const maxCode = Math.max(
                    ...existingIssues.map((issue) =>
                        parseInt(issue.ticket_no.slice(-4), 10)
                    )
                );
                sequenceNumber = (maxCode + 1).toString().padStart(6, '0');
            } else {
                sequenceNumber = '000001';
            }

            return `TBS${codeWC}${formattedDate}${sequenceNumber}`;
        }
        async function insertWeighBridge(selectWeightControlData) {
            const codeCompany = selectWeightControlData[0].code_company;
            const codeMill = selectWeightControlData[0].code_mill;
            return await model.mll_weigh_bridge.create(
                {
                    ticket_no: newCode,
                    company_code: codeCompany,
                    mill_code: codeMill,
                    estate_code: estate,
                    division_code: division,
                    unit_type: codeBlockList,
                    ffa: 0.00,
                    moist: 0.00,
                    dirt: 0.00,
                    dobi: 0.00,
                    transaction_type: 'IN',
                    entry_time: resultDateTime,
                    exit_time: null,
                    gross_weight: weightIn,
                    tare_weight: 0,
                    bruto: 0,
                    deduction: 0,
                    netto: 0,
                    uom: "KG",
                    code_item: 401000003,
                    sales_contract: "",
                    driver_name: driver,
                    spb_no: delivery,
                    vehicle_no: noVehicle,
                    seal_no: "",
                    bunch_count: totalBunches,
                    loose_fruit: looseFruit,
                    year_plant: plantingYear,
                    note: note,
                    created_by: employeeID,
                    ffb_source: source,
                    status: 1,
                    detail_block: codeBlockList,
                }, { transaction }
            );
        }


    } catch (error) {
        return responseHelper.error(res, error);
    }
};
controller.selectWeighBrigeByCode = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const code = req.body.code_POST;
        const selectWeighBrigeByCodeData = await model.mll_weigh_bridge.findOne({
            include: [
                {
                    attributes: ["fullname"],
                    model: model.adm_employee,
                },
            ],
            where: {
                ticket_no: code
            },
        });
        if (selectWeighBrigeByCodeData) {
            return responseHelper.success(res, "data success", selectWeighBrigeByCodeData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mencari weigh brige");
    }
};
controller.selectWeighBrigeByTicketNo = async function (req, res) {
    try {
        const requestData = req.body;
        const { language_POST: language, code_POST: code } = requestData;
        const selectWeighBrigeByCodeData = await model.mll_weigh_bridge.findOne({
            include: [
                {
                    attributes: ["fullname"],
                    model: model.adm_employee,
                },
            ],
            where: {
                ticket_no: code
            },
        });
        if (selectWeighBrigeByCodeData) {
            return responseHelper.success(res, "data success", selectWeighBrigeByCodeData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mencari weigh brige");
    }
};
controller.updateWeightBridge = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const requestData = req.body;
        const {
            language_POST: language,
            employeeID_POST: employeeID,
            ticket_no: ticketNo,
            weightOut_POST: weightOut,
            dateOut_POST: dateOut,
            grossWeight_POST: bruto,
            deduction_POST: deduction,
            netWeight_POST: netto,
        } = requestData;

        const [date, time] = dateOut.split(' ');
        const [day, month, year] = date.split('-');
        const formattedDateOut = `${year}-${month}-${day} ${time}`;

        const updateWeightBridgeData = await updateWeightBridge();
        if (!updateWeightBridgeData) {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }

        await transaction.commit();
        return responseHelper.success(res, messages[language]?.updateData || "Updated successfully", updateWeightBridgeData);

        async function updateWeightBridge() {
            return await model.mll_weigh_bridge.update({
                exit_time: formattedDateOut,
                tare_weight: weightOut,
                bruto: bruto,
                transaction_type: "OUT",
                deduction: deduction,
                netto: netto,
                // status: 2,
            }, {
                where: {
                    ticket_no: ticketNo,
                },
                transaction,
            });
        }

    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error);
    }
};
controller.updateWeightBridgeByStatus = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const requestData = req.body;
        const {
            language_POST: language,
            ticket_no: ticketNo,
        } = requestData;

        const updateWeightBridgeData = await updateWeightBridge();
        if (!updateWeightBridgeData) {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }

        await transaction.commit();
        return responseHelper.success(res, messages[language]?.updateData || "Updated successfully", updateWeightBridgeData);

        async function updateWeightBridge() {
            return await model.mll_weigh_bridge.update({
                status: 2,
            }, {
                where: {
                    ticket_no: ticketNo,
                },
                transaction,
            });
        }

    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error);
    }
};
// controller.selectVehicleNumberByTransaction = async function (req, res) {
//     try {
//         const requestData = req.body;
//         const { language_POST: language } = requestData;

//         const selectVehicleNumberData = await selectVehicleNumber();
//         if (selectVehicleNumberData.length === 0) {
//             return responseHelper.Unsuccessful(res, messages[language]?.nodata);
//         }

//         return responseHelper.success(res, messages[language]?.successfulData, selectVehicleNumberData);

//         async function selectVehicleNumber() {
//             return await model.adm_vehicle_number.findAll({
//                 where: {
//                     status: 1,
//                 },
//                 order: [
//                     ['status', 'DESC'],
//                     ['id_vehicle_number', 'ASC'],
//                 ],
//             });
//         }
//     } catch (error) {
//         return responseHelper.error(res, error);
//     }
// };
module.exports = controller;