const model = require("../models/index");
const koneksi = require("../config/database");
const messages = require("./message");
const { Op } = require("sequelize");
const logger = require('./logger');
const responseHelper = require('../helpers/responseHelper');

const controller = {};

controller.selectWeightControl = async function (req, res) {
    try {
        const requestData = req.body;
        const { language_POST: language } = requestData;

        const selectWeightControlData = await selectWeightControl();
        if (selectWeightControlData === null) {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }

        return responseHelper.success(res, messages[language]?.successfulData, selectWeightControlData);

        async function selectWeightControl() {
            return await model.mll_weight_control.findOne({
                order: [
                    ['code_company', 'ASC'],
                    ['createdAt', 'ASC'],
                ],
            });
        }
    } catch (error) {
        return responseHelper.error(res, error);
    }
};
controller.insertWeightControl = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const requestData = req.body;
        const {
            language_POST: language,
            data_POST: data
        } = requestData;

        const insertCompanyData = await insertCompany();
        if (!insertCompanyData) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.failedData);
        }

        const insertWeightControlData = await insertWeightControl();
        if (!insertWeightControlData) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.failedData);
        }


        await transaction.commit();
        return responseHelper.success(res, messages[language]?.successfulData, { insertCompanyData, insertWeightControlData });

        async function insertCompany() {
            const details = data.company_data;
            const detailRecords = details.map((item, index) => {
                return {
                    code_company: item.code_company,
                    name: item.name,
                    parent_code: item.parent_code,
                    level: item.level,
                };
            });
            return await model.adm_company.bulkCreate(detailRecords, { transaction });
        }

        async function insertWeightControl() {
            return await model.mll_weight_control.create(
                {
                    weight_control_code: data.weight_control.weight_control_code,
                    code_company: data.weight_control.company.code_company,
                    code_mill: data.weight_control.factory.code_company,
                    name_company: data.weight_control.company.name,
                    name_mill: data.weight_control.factory.name,
                    note: data.weight_control.note
                }, { transaction }
            );
        }

    } catch (error) {
        return responseHelper.error(res, error);
    }
};
module.exports = controller;