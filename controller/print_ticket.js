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
        const ticketNo = req.params.ticketNo;
        const ticket = await model.mll_weigh_bridge.findOne({
            where: { ticket_no: ticketNo }
        });

        if (!ticket) {
            return res.status(404).send("Ticket not found");
        }

        const weightControl = await model.mll_weight_control.findOne({
            where: { code_company: ticket.company_code }
        });
        const companyName = weightControl ? weightControl.name_company : 'PT SIA PLANTATION';

        const ticketData = {
            ...ticket.toJSON(),
            entry_time_formatted: ticket.entry_time ? moment(ticket.entry_time).format('YYYY-MM-DD HH:mm:ss') : '-',
            exit_time_formatted: ticket.exit_time ? moment(ticket.exit_time).format('YYYY-MM-DD HH:mm:ss') : '-'
        };
        const responseData = {
            ticket: ticketData,
            company: companyName
        };
        return responseHelper.success(res, responseData);
        // res.render('internal_ffb/print-ticket', {
        //     ticket: ticketData,
        //     companyName: companyName
        // });
    } catch (error) {
        return responseHelper.error(res, error);
    }
};
module.exports = controller;