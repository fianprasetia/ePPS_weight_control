const model = require("../models/index");
const koneksi = require("../config/database");
const messages = require("./message");
const sequelize = require('sequelize');
const { Op } = require("sequelize");
const logger = require('./logger');
const responseHelper = require('../helpers/responseHelper');

const controller = {};

controller.selectPartners = async function (req, res) {
    try {
        const requestData = req.body;
        const { language_POST: language } = requestData;

        const selectPartnersData = await selectPartners();
        if (selectPartnersData.length === 0) {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }

        return responseHelper.success(res, messages[language]?.successfulData, selectPartnersData);

        async function selectPartners() {
            return await model.adm_partners.findAll({
                order: [
                    ['name', 'ASC'],
                ],
            });
        }
    } catch (error) {
        return responseHelper.error(res, error);
    }
};
controller.insertPartners = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const requestData = req.body;
        const {
            language_POST: language,
            name_POST: name,
            address_POST: address,
            city_POST: city,
            phone_POST: phone,
            email_POST: email,
            contact_name_POST: contactName,
            isSupplier_POST: isSupplier,
            isSupplierTBS_POST: isSupplierTBS,
            isTransporter_POST: isTransporter,
            status_POST: status,
        } = requestData;

        const selectWeightControlData = await selectWeightControl();
        if (selectWeightControlData.length === 0) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }

        const newCode = await generateNewCode(selectWeightControlData);
        const insertPartnersData = await insertPartners();
        if (!insertPartnersData) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.failedData);
        }
        await transaction.commit();
        return responseHelper.success(res, messages[language]?.insertData, insertPartnersData);

        async function selectWeightControl() {
            return await model.mll_weight_control.findAll({
                attributes: ["weight_control_code"],
                transaction,
            });
        }
        async function generateNewCode(selectWeightControlData) {
            const codeWC = selectWeightControlData[0].weight_control_code;
            const existingIssues = await model.adm_partners.findAll({
                transaction,
            });
            let sequenceNumber;
            if (existingIssues.length > 0) {
                const maxCode = Math.max(
                    ...existingIssues.map((issue) =>
                        parseInt(issue.code_partners.slice(-4), 10)
                    )
                );
                sequenceNumber = (maxCode + 1).toString().padStart(5, '0');
            } else {
                sequenceNumber = '00001';
            }

            return `S001${codeWC}${sequenceNumber}`;
        }
        async function insertPartners() {
            return await model.adm_partners.create(
                {
                    code_partners: newCode,
                    name,
                    address,
                    city,
                    phone,
                    email,
                    contact_person: contactName,
                    is_supplier: isSupplier,
                    is_tbs_supplier: isSupplierTBS,
                    is_transporter: isTransporter,
                    status: status,
                    synch: 0,
                }, { transaction }
            );
        }


    } catch (error) {
        return responseHelper.error(res, error);
    }
};
controller.selectPartnersByCode = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const code = req.body.code_partners_POST;
        const selectPartnersByCodeData = await model.adm_partners.findOne({
            where: {
                code_partners: code
            },
        });
        if (selectPartnersByCodeData) {
            return responseHelper.success(res, messages[language]?.nodata, selectPartnersByCodeData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mencari weigh brige");
    }
};
controller.updatePartners = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const requestData = req.body;
        const {
            language_POST: language,
            code_POST: code,
            name_POST: name,
            address_POST: address,
            city_POST: city,
            phone_POST: phone,
            email_POST: email,
            contact_name_POST: contactName,
            isSupplier_POST: isSupplier,
            isSupplierTBS_POST: isSupplierTBS,
            isTransporter_POST: isTransporter,
            status_POST: status,
        } = requestData;

        const updatePartnersData = await updatePartners();
        if (!updatePartnersData) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }

        await transaction.commit();
        return responseHelper.success(res, messages[language]?.updateData || "Updated successfully", updatePartnersData);

        async function updatePartners() {
            return await model.adm_partners.update({
                name,
                address,
                city,
                phone,
                email,
                contact_person: contactName,
                is_supplier: isSupplier,
                is_tbs_supplier: isSupplierTBS,
                is_transporter: isTransporter,
                status: status,
                synch: 0,
            }, {
                where: {
                    code_partners: code,
                },
                transaction,
            });
        }

    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error);
    }
};
module.exports = controller;