const model = require("../models/index");
const koneksi = require("../config/database");
const messages = require("./message");
const sequelize = require('sequelize');
const { Op } = require("sequelize");
const logger = require('./logger');
const responseHelper = require('../helpers/responseHelper');

const controller = {};

controller.selectVehicleNumber = async function (req, res) {
    try {
        const requestData = req.body;
        const { language_POST: language } = requestData;

        const selectVehicleNumberData = await selectVehicleNumber();
        if (selectVehicleNumberData.length === 0) {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }

        return responseHelper.success(res, messages[language]?.successfulData, selectVehicleNumberData);

        async function selectVehicleNumber() {
            return await model.adm_vehicle_number.findAll({
                order: [
                    ['status', 'DESC'],
                    ['id_vehicle_number', 'ASC'],
                ],
            });
        }
    } catch (error) {
        return responseHelper.error(res, error);
    }
};
controller.insertVehicleNumber = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const requestData = req.body;
        const {
            language_POST: language,
            vehicle_number_POST: vehicle_number,
            status_POST: status,
        } = requestData;

        const isDuplicate = await checkDuplicateVehicleNumber();
        if (isDuplicate) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.duplicateData);
        }

        const insertVehicleNumberData = await insertVehicleNumber();
        if (!insertVehicleNumberData) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.failedData);
        }


        await transaction.commit();
        return responseHelper.success(res, messages[language]?.insertData);

        async function checkDuplicateVehicleNumber() {
            const existing = await model.adm_vehicle_number.findOne({
                where: {
                    no_vehicle: vehicle_number,
                },
                transaction,
            });
            return !!existing;
        }
        async function insertVehicleNumber() {
            return await model.adm_vehicle_number.create(
                {
                    no_vehicle: vehicle_number,
                    status: status
                }, { transaction }
            );
        }


    } catch (error) {
        return responseHelper.error(res, error);
    }
};
controller.selectVehicleNumberByCode = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const code = req.body.code_POST;
        const selectVehicleNumberByCodeData = await model.adm_vehicle_number.findOne({
            where: {
                id_vehicle_number: code
            },
        });
        if (selectVehicleNumberByCodeData) {
            return responseHelper.success(res, "data success", selectVehicleNumberByCodeData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mencari user");
    }
};
controller.updateVehicleNumber = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const language = req.body.language_POST || 'en';
        const id_vehicle_number = req.body.code_POST;
        const no_vehicle = req.body.vehicle_number_POST;
        const status = req.body.status_POST;

        const updateVehicleNumberData = await model.adm_vehicle_number.update(
            {
                no_vehicle: no_vehicle,
                status: status,
            },
            {
                where: {
                    id_vehicle_number: id_vehicle_number
                },
                transaction
            },
        );

        if (updateVehicleNumberData) {
            await transaction.commit();
            return responseHelper.success(res, messages[language]?.updateData, updateVehicleNumberData);
        } else {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan saat memperbarui password");
    }
};
controller.selectVehicleNumberByTransaction = async function (req, res) {
    try {
        const requestData = req.body;
        const { language_POST: language } = requestData;

        const selectVehicleNumberData = await selectVehicleNumber();
        if (selectVehicleNumberData.length === 0) {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }

        return responseHelper.success(res, messages[language]?.successfulData, selectVehicleNumberData);

        async function selectVehicleNumber() {
            return await model.adm_vehicle_number.findAll({
                where: {
                    status: 1,
                },
                order: [
                    ['status', 'DESC'],
                    ['id_vehicle_number', 'ASC'],
                ],
            });
        }
    } catch (error) {
        return responseHelper.error(res, error);
    }
};
module.exports = controller;