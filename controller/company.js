const model = require("../models/index")
const messages = require("./message")
const koneksi = require("../config/database");
const sequelize = require("sequelize");
const controller = {}
const { Op, json } = require("sequelize")
const logger = require('./logger');
const responseHelper = require('../helpers/responseHelper');

controller.selectCompany = async function (req, res) {
    try {
        var language = req.body.language_POST
        let selectCompanyData = await model.adm_company.findAll({
            order: [
                ['level', 'ASC'],
                ['code_company', 'ASC'],
            ],
        });
        if (selectCompanyData.length > 0) {
            res.status(200).json({
                access: "success",
                message: messages[language]?.insertData,
                data: selectCompanyData,
            });
        } else {
            res.status(200).json({
                access: "failed",
                message: messages[language]?.nodata,
                data: [],
            });
        }
    } catch (error) {
        res.status(404).json({
            message: error,
        });
    }
}
controller.selectCompanyByEstate = async function (req, res) {
    try {
        let language = req.body.language_POST;
        let selectCompanyByDivisionData = await model.adm_company.findAll({
            attributes: ["code_company", "name"],
            where: {
                level: '03',
            },
            order: [
                ['code_company', 'ASC'],
            ],
        });
        if (selectCompanyByDivisionData.length > 0) {
            return responseHelper.success(res, messages[language]?.successfulData, selectCompanyByDivisionData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mencari perusahaan berdasarkan level 02");
    }
};
controller.selectCompanyByDivision = async function (req, res) {
    try {
        var language = req.body.language_POST
        var estate = req.body.estate_POST
        let selectCompanyByDivisionData = await model.adm_company.findAll({
            attributes: ["code_company", "name"],
            where: {
                parent_code: estate
            },
            order: [
                ['level', 'ASC'],
                ['code_company', 'ASC'],
            ],
        });
        if (selectCompanyByDivisionData.length > 0) {
            return responseHelper.success(res, messages[language]?.successfulData, selectCompanyByDivisionData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mencari perusahaan berdasarkan Division");
    }
}
controller.selectCompanyByBlock = async function (req, res) {
    try {
        var language = req.body.language_POST
        var division = req.body.division_POST
        let selectCompanyByDivisionData = await model.adm_company.findAll({
            attributes: ["code_company", "name"],
            where: {
                parent_code: division
            },
            order: [
                ['level', 'ASC'],
                ['code_company', 'ASC'],
            ],
        });
        if (selectCompanyByDivisionData.length > 0) {
            return responseHelper.success(res, messages[language]?.successfulData, selectCompanyByDivisionData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mencari perusahaan berdasarkan Division");
    }
}
module.exports = controller;