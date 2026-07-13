const model = require("../models/index");
const koneksi = require("../config/database");
const messages = require("./message");
const sequelize = require('sequelize');
const { Op } = require("sequelize");
const logger = require('./logger');
const responseHelper = require('../helpers/responseHelper');
const moment = require("moment");

const controller = {};

controller.selectPrintTicket = async function (req, res) {
    try {
        const requestData = req.body;
        const {
            language_POST: language,
            ticket_POST: ticketNo
        } = requestData;

        const selectWeighControlData = await selectWeighControl();
        if (selectWeighControlData.length === 0) {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }
        const selectWeighBridgeData = await selectWeighBridge(ticketNo);
        if (selectWeighBridgeData.length === 0) {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }
        const responseData = {
            dataWeighControl: selectWeighControlData,
            dataWeighBridge: selectWeighBridgeData
        };
        return responseHelper.success(res, messages[language]?.successfulData, responseData);

        async function selectWeighControl() {
            return await model.mll_weight_control.findOne({
                attributes: ["code_company", "code_mill", "name_company", "name_mill"],
            });
        }
        async function selectWeighBridge() {
            return await model.mll_weigh_bridge.findOne({
                where: { ticket_no: ticketNo },
                include: [
                    {
                        model: model.adm_company,
                        as: "division"
                    },
                    {
                        model: model.adm_employee,
                    },

                ]
            });
        }

    } catch (error) {
        return responseHelper.error(res, error);
    }
};
module.exports = controller;